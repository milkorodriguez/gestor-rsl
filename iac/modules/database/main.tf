data "aws_vpc" "vpc_por_defecto" {
  default = true
}

data "aws_subnets" "sub_redes_por_defecto" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.vpc_por_defecto.id]
  }
}

# Security group propio de la RDS: abre el 3306 (equivale a la regla
# de entrada que el profesor agrega a mano en la consola).
resource "aws_security_group" "rds_sg" {
  name        = "${var.nombre_instancia_rds}-rds-sg"
  description = "Permite acceso MySQL (3306) a la RDS de gestor-rsl"
  vpc_id      = data.aws_vpc.vpc_por_defecto.id

  ingress {
    description = "MySQL/Aurora"
    from_port   = 3306
    to_port     = 3306
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_db_subnet_group" "rds_subnet_group" {
  name       = "${var.nombre_instancia_rds}-subnet-group"
  subnet_ids = data.aws_subnets.sub_redes_por_defecto.ids
}

resource "aws_db_instance" "gestor_rsl_mysql" {
  identifier              = var.nombre_instancia_rds
  engine                  = "mysql"
  engine_version          = var.rds_engine_version
  instance_class          = var.rds_instance_class
  allocated_storage       = var.rds_allocated_storage
  max_allocated_storage   = var.rds_max_allocated_storage
  db_name                 = var.nombre_esquema
  username                = var.usuario_base_datos
  password                = var.contrasenha_base_datos
  db_subnet_group_name    = aws_db_subnet_group.rds_subnet_group.name
  vpc_security_group_ids  = [aws_security_group.rds_sg.id]
  publicly_accessible     = var.rds_publicly_accessible
  skip_final_snapshot     = true
  deletion_protection     = false
  backup_retention_period = 0
  apply_immediately       = true
}

resource "null_resource" "inicializar_base_datos" {
  triggers = {
    rds_endpoint = aws_db_instance.gestor_rsl_mysql.address
    sql_hash     = filesha1(var.sql_script_path)
  }

  provisioner "local-exec" {
    environment = {
      DB_HOST                        = aws_db_instance.gestor_rsl_mysql.address
      DB_PORT                        = tostring(aws_db_instance.gestor_rsl_mysql.port)
      DB_USER                        = var.usuario_base_datos
      DB_PASSWORD                    = var.contrasenha_base_datos
      DB_NAME                        = var.nombre_esquema
      SQL_SCRIPT                     = var.sql_script_path
      DB_INIT_TIMEOUT_SECONDS        = tostring(var.db_init_timeout_seconds)
      DB_INIT_RETRY_INTERVAL_SECONDS = tostring(var.db_init_retry_interval_seconds)
    }
    interpreter = ["/bin/bash", "-c"]
    command     = <<-EOT
      set -euo pipefail

      start_ts=$(date +%s)
      deadline=$((start_ts + DB_INIT_TIMEOUT_SECONDS))
      intento=0

      while true; do
        intento=$((intento + 1))
        now=$(date +%s)

        if mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" --protocol=TCP --connect-timeout=5 -e "SELECT 1" >/dev/null 2>&1; then
          echo "RDS disponible y conexion validada."
          break
        fi

        if [ "$now" -ge "$deadline" ]; then
          echo "ERROR: RDS no disponible tras $${DB_INIT_TIMEOUT_SECONDS}s (intentos: $${intento})."
          exit 1
        fi

        echo "Esperando RDS... intento $${intento}."
        sleep "$DB_INIT_RETRY_INTERVAL_SECONDS"
      done

      echo "Cargando $SQL_SCRIPT en el esquema $DB_NAME ..."
      mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" --protocol=TCP --connect-timeout=10 "$DB_NAME" < "$SQL_SCRIPT"

      echo "Validando que la tabla ARTICULO exista..."
      tablas=$(mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" --protocol=TCP --connect-timeout=10 -Nse "
        SELECT COUNT(*) FROM information_schema.tables
        WHERE table_schema = '$DB_NAME' AND table_name = 'ARTICULO';
      ")
      if [ "$tablas" -ne 1 ]; then
        echo "ERROR: no se encontro la tabla ARTICULO tras cargar el script."
        exit 1
      fi
      echo "Base de datos inicializada correctamente."
    EOT
  }

  depends_on = [aws_db_instance.gestor_rsl_mysql]
}
