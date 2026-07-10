variable "nombre_cluster" { type = string }
variable "familia_tarea" { type = string }
variable "nombre_servicio_ecs" { type = string }
variable "rol_lab_arn" { type = string }
variable "id_cuenta_aws" { type = string }
variable "region_aws" { type = string }
variable "nombre_repo_ecr" { type = string }
variable "tag_imagen" { type = string }
variable "db_url" { type = string }
variable "usuario_base_datos" { type = string }
variable "contrasenha_base_datos" {
  type      = string
  sensitive = true
}
