#include "clip.h"
#include "png.h"
#include "zlib.h"
#include <vector>
#include <node_api.h>

napi_value GetText(napi_env env, napi_callback_info info)
{
    napi_status status;
    napi_value text;
    std::string value;
    clip::get_text(value);
    status = napi_create_string_utf8(env, value.c_str(), NAPI_AUTO_LENGTH, &text);
    assert(status == napi_ok);
    return text;
}

napi_value SetText(napi_env env, napi_callback_info info)
{
    napi_status status;

    size_t argc = 1;
    napi_value args[1];
    status = napi_get_cb_info(env, info, &argc, args, nullptr, nullptr);
    assert(status == napi_ok);

    if (argc < 1)
    {
        napi_throw_type_error(env, nullptr, "Wrong number of arguments");
        return nullptr;
    }

    napi_valuetype valuetype;
    status = napi_typeof(env, args[0], &valuetype);
    assert(status == napi_ok);

    if (valuetype != napi_string)
    {
        napi_throw_type_error(env, nullptr, "Must be of type string");
        return nullptr;
    }
    size_t length;
    napi_get_value_string_utf8(env, args[0], nullptr, 0, &length);

    char *text = (char *)malloc(length + 1);
    status = napi_get_value_string_utf8(env, args[0], text, length + 1, nullptr);
    assert(status == napi_ok);

    std::string value(text);
    clip::set_text(value);

    return nullptr;
}

napi_value GetImage(napi_env env, napi_callback_info info)
{
    if (!clip::has(clip::image_format()))
    {
        napi_throw_error(env, nullptr, "Clipboard doesn't contain an image.");
        return nullptr;
    }

    clip::image img;
    if (!clip::get_image(img))
    {
        napi_throw_error(env, nullptr, "Error getting image from clipboard.");
        return nullptr;
    }

    auto errorHandler = [](png_structp pngPtr, png_const_charp message) {
        // napi_throw_error(env, nullptr, message);
    };
    auto warningHandler = [](png_structp pngPtr, png_const_charp message) {};

    png_structp pngPtr = png_create_write_struct(PNG_LIBPNG_VER_STRING, nullptr, errorHandler, warningHandler);
    if (!pngPtr)
    {
        napi_throw_error(env, nullptr, "Unable to initialize libpng for writing.");
        return nullptr;
    }

    png_infop infoPtr = png_create_info_struct(pngPtr);
    if (!infoPtr)
    {
        napi_throw_error(env, nullptr, "Unable to initialize libpng info struct.");
        return nullptr;
    }

    if (setjmp(png_jmpbuf(pngPtr)))
    {
        napi_throw_error(env, nullptr, "Error encoding PNG.");
        return nullptr;
    }

    std::vector<uint8_t> encoded;

    png_set_write_fn(pngPtr, &encoded, [](png_structp pngPtr, png_bytep data, png_size_t length) {
        auto encoded = reinterpret_cast<std::vector<uint8_t> *>(png_get_io_ptr(pngPtr));
        encoded->insert(encoded->end(), data, data + length); }, nullptr);

    png_set_compression_level(pngPtr, Z_BEST_COMPRESSION);

    auto spec = img.spec();
    auto width = spec.width;
    auto height = spec.height;
    auto colorType = (spec.alpha_mask ? PNG_COLOR_TYPE_RGB_ALPHA : PNG_COLOR_TYPE_RGB);

    png_set_IHDR(pngPtr, infoPtr, width, height, 8, colorType, PNG_INTERLACE_NONE, PNG_COMPRESSION_TYPE_DEFAULT, PNG_FILTER_TYPE_DEFAULT);

    png_write_info(pngPtr, infoPtr);

    png_bytep row =
        (png_bytep)png_malloc(pngPtr, png_get_rowbytes(pngPtr, infoPtr));

    for (png_uint_32 y = 0; y < spec.height; ++y)
    {
        const uint32_t *src =
            (const uint32_t *)(((const uint8_t *)img.data()) + y * spec.bytes_per_row);
        uint8_t *dst = row;
        unsigned int x, c;

        for (x = 0; x < spec.width; x++)
        {
            c = *(src++);
            *(dst++) = (c & spec.red_mask) >> spec.red_shift;
            *(dst++) = (c & spec.green_mask) >> spec.green_shift;
            *(dst++) = (c & spec.blue_mask) >> spec.blue_shift;
            if (colorType == PNG_COLOR_TYPE_RGB_ALPHA)
                *(dst++) = (c & spec.alpha_mask) >> spec.alpha_shift;
        }

        png_write_rows(pngPtr, &row, 1);
    }
    png_free(pngPtr, row);
    png_write_end(pngPtr, nullptr);
    png_destroy_write_struct(&pngPtr, &infoPtr);
    napi_value buffer;
    assert(napi_create_buffer_copy(env, encoded.size(),
                                   reinterpret_cast<char *>(&encoded[0]),
                                   nullptr,
                                   &buffer) == napi_ok);

    return buffer;
}

#define DECLARE_NAPI_METHOD(name, func)         \
    {                                           \
        name, 0, func, 0, 0, 0, napi_default, 0 \
    }

napi_value Init(napi_env env, napi_value exports)
{
    napi_status status;
    napi_property_descriptor descriptors[] = {
        DECLARE_NAPI_METHOD("getText", GetText),
        DECLARE_NAPI_METHOD("setText", SetText),
        DECLARE_NAPI_METHOD("getImage", GetImage)};
    status = napi_define_properties(env, exports, sizeof(descriptors) / sizeof(descriptors[0]), descriptors);
    assert(status == napi_ok);
    return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, Init)
