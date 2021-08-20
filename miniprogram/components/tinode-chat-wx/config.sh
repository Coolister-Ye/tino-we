docker run -p 6060:6060 -d --name tinode-srv --network tinode-net \
		--volume /root/tinode.new.conf:/tinode.conf \
		--env EXT_CONFIG=/tinode.conf \
		tinode/tinode-mysql:latest