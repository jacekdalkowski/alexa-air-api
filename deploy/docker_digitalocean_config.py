config = dict(
	dev = dict(
		ssh_con_str = "root@207.154.255.70",
		image_tag = "alexa-air-dev/web-api",
		container_name = "alexa-air-dev-web-api",
		db_container_name = "alexa-air-dev-web-db",
		deploy_dir = "/root/apps/alexa/air/dev/web/api"
	),
	prod1 = dict(
		ssh_con_str = "root@207.154.255.70",
		image_tag = "alexa-air-prod1/web-api",
		container_name = "alexa-air-prod1-web-api",
		db_container_name = "alexa-air-prod1-web-db",
		deploy_dir = "/root/apps/alexa/air/prod1/web/api"
	),
	prod2 = dict(
		ssh_con_str = "root@207.154.255.70",
		image_tag = "alexa-air-prod2/web-api",
		container_name = "alexa-air-prod2-web-api",
		db_container_name = "alexa-air-prod2-web-db",
		deploy_dir = "/root/apps/alexa/air/prod2/web/api"
	)
)