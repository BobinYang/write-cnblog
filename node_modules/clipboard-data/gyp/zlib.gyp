{
    "targets" : [
        {
            "target_name" : "zlib",
            "type" : "static_library",
            "include_dirs": [
                "../modules/zlib"
            ],
            "sources" : [
                "../modules/zlib/adler32.c",
                "../modules/zlib/compress.c",
                "../modules/zlib/crc32.c",
                "../modules/zlib/deflate.c",
                "../modules/zlib/gzclose.c",
                "../modules/zlib/gzlib.c",
                "../modules/zlib/gzread.c",
                "../modules/zlib/gzwrite.c",
                "../modules/zlib/infback.c",
                "../modules/zlib/inffast.c",
                "../modules/zlib/inflate.c",
                "../modules/zlib/inftrees.c",
                "../modules/zlib/trees.c",
                "../modules/zlib/uncompr.c",
                "../modules/zlib/zutil.c"
            ]
        }
    ]
}