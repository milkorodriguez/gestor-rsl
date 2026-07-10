provider "aws" {
  region = var.region
}

locals {
  rol_lab_arn = "arn:aws:iam::${var.id_cuenta_aws}:role/${var.nombre_rol_iam}"
  db_url = "jdbc:mysql://${module.database.rds_endpoint}:${module.database.rds_port}/${var.nombre_esquema}?useSSL=false&allowPublicKeyRetrieval=true"
}

module "database" {
  source                         = "./modules/database"
  nombre_instancia_rds           = var.nombre_instancia_rds
  usuario_base_datos             = var.usuario_base_datos
  contrasenha_base_datos         = var.contrasenha_base_datos
  nombre_esquema                 = var.nombre_esquema
  sql_script_path                = "${path.root}/../slr_rsl.sql"
  rds_instance_class             = var.rds_instance_class
  rds_allocated_storage          = var.rds_allocated_storage
  rds_max_allocated_storage      = var.rds_max_allocated_storage
  rds_engine_version             = var.rds_engine_version
  rds_publicly_accessible        = var.rds_publicly_accessible
  db_init_timeout_seconds        = var.db_init_timeout_seconds
  db_init_retry_interval_seconds = var.db_init_retry_interval_seconds
}

module "compute" {
  source                 = "./modules/compute"
  nombre_cluster         = var.nombre_cluster_ecs
  familia_tarea          = var.familia_tarea_ecs
  rol_lab_arn            = local.rol_lab_arn
  id_cuenta_aws          = var.id_cuenta_aws
  region_aws             = var.region
  nombre_repo_ecr        = var.nombre_repo_ecr
  tag_imagen             = var.tag_imagen
  db_url                 = local.db_url
  usuario_base_datos     = var.usuario_base_datos
  contrasenha_base_datos = var.contrasenha_base_datos
  nombre_servicio_ecs    = var.nombre_servicio_ecs
}
