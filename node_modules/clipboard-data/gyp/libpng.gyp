{
    "targets" : [
        {
            "dependencies": [
                "zlib.gyp:zlib"
            ],
            "target_name" : "libpng",
            "type" : "static_library",
            "include_dirs": [
                "../src/configs",
                "../modules/lpng"
            ],
            "sources" : [
                "../modules/lpng/png.c",
                "../modules/lpng/pngerror.c",
                "../modules/lpng/pngget.c",
                "../modules/lpng/pngmem.c",
                "../modules/lpng/pngpread.c",
                "../modules/lpng/pngread.c",
                "../modules/lpng/pngrio.c",
                "../modules/lpng/pngrtran.c",
                "../modules/lpng/pngrutil.c",
                "../modules/lpng/pngset.c",
                "../modules/lpng/pngtrans.c",
                "../modules/lpng/pngwio.c",
                "../modules/lpng/pngwrite.c",
                "../modules/lpng/pngwtran.c",
                "../modules/lpng/pngwutil.c"
            ]
        }
    ]
}