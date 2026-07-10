variable "region" {
  description = "Region AWS donde se despliegan los recursos"
  default     = "us-east-1"
}

variable "id_cuenta_aws" {
  description = "ID de la cuenta de AWS"
  type        = string
}

variable "nombre_rol_iam" {
  description = "Nombre del rol IAM para ECS (ej. LabRole en AWS Academy)"
  type        = string
}

# --- ECS / compute ---
variable "nombre_cluster_ecs" {
  description = "Nombre del cluster ECS"
  type        = string
  default     = "gestor-rsl-cluster"
}

variable "familia_tarea_ecs" {
  description = "Familia de la task definition"
  type        = string
  default     = "gestor-rsl-task"
}

variable "nombre_servicio_ecs" {
  description = "Nombre del servicio ECS"
  type        = string
  default     = "servicio-gestor-rsl"
}

variable "nombre_repo_ecr" {
  description = "Repositorio ECR de la imagen"
  type        = string
  default     = "gestor-rsl"
}

variable "tag_imagen" {
  description = "Tag de la imagen Docker"
  type        = string
  default     = "latest"
}

# --- RDS / database ---
variable "nombre_instancia_rds" {
  description = "Identificador de la instancia RDS MySQL"
  type        = string
  default     = "gestor-rsl"
}

variable "nombre_esquema" {
  description = "Nombre del esquema/base de datos MySQL"
  type        = string
  default     = "slr_rsl"
}

variable "usuario_base_datos" {
  description = "Usuario administrador de RDS"
  type        = string
  default     = "admin"
}

variable "contrasenha_base_datos" {
  description = "Contrasena del usuario RDS (pasar por -var o TF_VAR_)"
  type        = string
  sensitive   = true
}

variable "rds_instance_class" {
  description = "Clase de instancia RDS"
  type        = string
  default     = "db.t3.micro"
}

variable "rds_allocated_storage" {
  description = "Almacenamiento inicial en GB"
  type        = number
  default     = 20
}

variable "rds_max_allocated_storage" {
  description = "Almacenamiento maximo (autoescalado)"
  type        = number
  default     = 100
}

variable "rds_engine_version" {
  description = "Version de MySQL"
  type        = string
  default     = "8.0"
}

variable "rds_publicly_accessible" {
  description = "RDS accesible publicamente (true facilita la carga del .sql)"
  type        = bool
  default     = true
}

variable "db_init_timeout_seconds" {
  description = "Tiempo maximo de espera por disponibilidad de RDS"
  type        = number
  default     = 300
}

variable "db_init_retry_interval_seconds" {
  description = "Intervalo entre reintentos"
  type        = number
  default     = 15
}
