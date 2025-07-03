package com.example.android_app;

import androidx.room.TypeConverter;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import java.lang.reflect.Type;
import java.util.Date;
import java.util.List;

public class Converters {

    // 🔁 המרה מ-List<String> למחרוזת JSON
    @TypeConverter
    public String fromStringList(List<String> list) {
        return new Gson().toJson(list);
    }

    // 🔁 המרה ממחרוזת JSON ל-List<String>
    @TypeConverter
    public List<String> toStringList(String json) {
        Type listType = new TypeToken<List<String>>() {}.getType();
        return new Gson().fromJson(json, listType);
    }

    // 🔁 המרה מתאריך ל-long
    @TypeConverter
    public static Long fromDate(Date date) {
        return date == null ? null : date.getTime();
    }

    // 🔁 המרה מ-long לתאריך
    @TypeConverter
    public static Date toDate(Long timestamp) {
        return timestamp == null ? null : new Date(timestamp);
    }
}
