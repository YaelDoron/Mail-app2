package com.example.android_app.utils;

import androidx.annotation.NonNull;

import java.io.IOException;
import java.io.InputStream;

import okhttp3.MediaType;
import okhttp3.RequestBody;
import okio.BufferedSink;

public class InputStreamRequestBody extends RequestBody {

    private final MediaType contentType;
    private final InputStream inputStream;

    public InputStreamRequestBody(MediaType contentType, InputStream inputStream) {
        this.contentType = contentType;
        this.inputStream = inputStream;
    }

    @Override
    public MediaType contentType() {
        return contentType;
    }

    @Override
    public void writeTo(@NonNull BufferedSink sink) throws IOException {
        byte[] buffer = new byte[2048];
        int read;
        while ((read = inputStream.read(buffer)) != -1) {
            sink.write(buffer, 0, read);
        }
        inputStream.close();
    }
}
