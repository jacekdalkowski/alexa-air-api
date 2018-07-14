import os
from docker_digitalocean_common import *

def copy_api_src_to_remote_host(ssh_con_str, deploy_dir):
	pwd = run_local_command("pwd").rstrip()
	local_dir = pwd + "/../*"
	print "Copying web-api src (" + local_dir + ") to remote host."
	rsync_cmd = "rsync -azP --delete --exclude '*/node_modules' " + local_dir + " " + ssh_con_str + ":" + deploy_dir
	print "rsync command: " + rsync_cmd
	os.system(rsync_cmd)
	print "Copying web-api src to remote host finished."

def build_api_continer_in_remote_host(ssh, tag, build_dir):
	print "Building alexa-air-dev/web-api image in remote host."
	result = ssh("docker build -t " + tag + " " + build_dir)
	print "Building " + tag + " image in remote host result: "
	print result

def run_api_container(ssh, image_tag, db_container_name, name):
	print "Starting " + image_tag + " container in remote host."
	result = ssh("docker run --name " + name + " --link " + db_container_name + ":air-db -d " + image_tag)
	print "Starting " + image_tag + " container in remote host result: "
	print result

