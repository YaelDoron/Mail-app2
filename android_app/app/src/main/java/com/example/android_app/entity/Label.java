package com.example.android_app.entity;

import androidx.annotation.NonNull;
import androidx.room.Entity;
import androidx.room.PrimaryKey;

import com.google.gson.annotations.SerializedName;

import java.util.Objects;

@Entity(tableName = "labels")
public class Label {
    @NonNull
    @PrimaryKey
    public String id;

    @SerializedName("name")
    public String name;

    @SerializedName("owner")
    public String owner;

    public Label() {}

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

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (!(obj instanceof Label)) return false;
        Label other = (Label) obj;
        return id.equals(other.id) &&
                name.equals(other.name) &&
                owner.equals(other.owner);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, owner);
    }
}