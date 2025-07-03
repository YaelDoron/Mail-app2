package com.example.android_app.entity;

import androidx.room.Entity;
import androidx.room.PrimaryKey;

import com.google.gson.annotations.SerializedName;

@Entity(tableName = "labels")
public class Label {

    @SerializedName("id") // שם מהשרת (MongoDB)
    @PrimaryKey
    public String id;

    @SerializedName("name")
    public String name;

    @SerializedName("owner")
    public String owner;

    // בנאי ריק (Room דורש)
    public Label() {}

    // Getters ו-Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getOwner() {
        return owner;
    }

    public void setOwner(String owner) {
        this.owner = owner;
    }
}
