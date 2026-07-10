resource "aws_ecs_cluster" "cluster_gestor_rsl" {
  name = var.nombre_cluster
}

data "aws_vpc" "vpc_por_defecto" {
  default = true
}

data "aws_subnets" "sub_redes_por_defecto" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.vpc_por_defecto.id]
  }
}

data "aws_security_group" "grupo_seguridad_por_defecto" {
  name   = "default"
  vpc_id = data.aws_vpc.vpc_por_defecto.id
}

resource "aws_security_group" "alb_security_group" {
  name        = "${var.nombre_cluster}-alb-sg"
  description = "Permite trafico HTTP hacia el ALB"
  vpc_id      = data.aws_vpc.vpc_por_defecto.id

  ingress {
    from_port   = 80
    to_port     = 80
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

resource "aws_security_group" "ecs_security_group" {
  name        = "${var.nombre_cluster}-ecs-sg"
  description = "Permite trafico del ALB a ECS en 8080"
  vpc_id      = data.aws_vpc.vpc_por_defecto.id

  ingress {
    from_port       = 8080
    to_port         = 8080
    protocol        = "tcp"
    security_groups = [aws_security_group.alb_security_group.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_cloudwatch_log_group" "ecs_logs" {
  name              = "/ecs/${var.nombre_servicio_ecs}"
  retention_in_days = 7
}

resource "aws_ecs_task_definition" "definicion_tarea" {
  family                   = var.familia_tarea
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = "512"
  memory                   = "1024"
  execution_role_arn       = var.rol_lab_arn
  task_role_arn            = var.rol_lab_arn

  container_definitions = jsonencode([{
    name      = "gestor-rsl",
    image     = "${var.id_cuenta_aws}.dkr.ecr.${var.region_aws}.amazonaws.com/${var.nombre_repo_ecr}:${var.tag_imagen}",
    essential = true,
    portMappings = [
      {
        containerPort = 8080,
        protocol      = "tcp"
      }
    ],
    environment = [
      { name = "DB_URL", value = var.db_url },
      { name = "DB_USER", value = var.usuario_base_datos },
      { name = "DB_PASSWORD", value = var.contrasenha_base_datos }
    ],
    logConfiguration = {
      logDriver = "awslogs"
      options = {
        awslogs-group         = aws_cloudwatch_log_group.ecs_logs.name
        awslogs-region        = var.region_aws
        awslogs-stream-prefix = "ecs"
      }
    }
  }])
}

resource "aws_lb" "gestor_rsl_alb" {
  name               = "gestor-rsl-alb"
  internal           = false
  load_balancer_type = "application"
  subnets            = data.aws_subnets.sub_redes_por_defecto.ids
  security_groups    = [aws_security_group.alb_security_group.id]
}

resource "aws_lb_target_group" "tg_gestor_rsl" {
  name        = "tg-gestor-rsl"
  port        = 8080
  protocol    = "HTTP"
  vpc_id      = data.aws_vpc.vpc_por_defecto.id
  target_type = "ip"

  health_check {
    path                = "/actuator/health"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 3
    matcher             = "200"
  }
}

resource "aws_lb_listener" "http_listener" {
  load_balancer_arn = aws_lb.gestor_rsl_alb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.tg_gestor_rsl.arn
  }
}

resource "aws_ecs_service" "servicio_gestor_rsl" {
  name            = var.nombre_servicio_ecs
  cluster         = aws_ecs_cluster.cluster_gestor_rsl.id
  task_definition = aws_ecs_task_definition.definicion_tarea.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  load_balancer {
    target_group_arn = aws_lb_target_group.tg_gestor_rsl.arn
    container_name   = "gestor-rsl"
    container_port   = 8080
  }

  network_configuration {
    subnets          = data.aws_subnets.sub_redes_por_defecto.ids
    security_groups  = [aws_security_group.ecs_security_group.id, data.aws_security_group.grupo_seguridad_por_defecto.id]
    assign_public_ip = true
  }

  deployment_controller {
    type = "ECS"
  }

  depends_on = [aws_lb_listener.http_listener]
}
