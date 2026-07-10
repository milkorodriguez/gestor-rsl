variable "nombre_instancia_rds" { type = string }
variable "usuario_base_datos" { type = string }
variable "contrasenha_base_datos" {
  type      = string
  sensitive = true
}
variable "nombre_esquema" { type = string }
variable "sql_script_path" { type = string }
variable "rds_instance_class" { type = string }
variable "rds_allocated_storage" { type = number }
variable "rds_max_allocated_storage" { type = number }
variable "rds_engine_version" { type = string }
variable "rds_publicly_accessible" { type = bool }
variable "db_init_timeout_seconds" { type = number }
variable "db_init_retry_interval_seconds" { type = number }
