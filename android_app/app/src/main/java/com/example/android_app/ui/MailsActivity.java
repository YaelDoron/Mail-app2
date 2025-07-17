package com.example.android_app.ui;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.PopupMenu;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.drawerlayout.widget.DrawerLayout;
import androidx.lifecycle.Observer;
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.example.android_app.R;
import com.example.android_app.core.AppDatabase;
import com.example.android_app.core.MyApplication;
import com.example.android_app.adapters.MailAdapter;
import com.example.android_app.entity.Label;
import com.example.android_app.entity.User;
import com.example.android_app.viewmodel.LabelViewModel;
import com.example.android_app.viewmodel.MailViewModel;
import com.example.android_app.viewmodel.UserViewModel;
import com.google.android.material.navigation.NavigationView;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class MailsActivity extends AppCompatActivity {
    private User cachedUser;
    private MailAdapter adapter;
    private DrawerLayout drawerLayout;
    private RecyclerView recyclerView;
    private MailViewModel mailViewModel;
    private UserViewModel userViewModel;
    private NavigationView navigationView;
    private LabelViewModel labelViewModel;

    private boolean isSearching = false;
    private String currentLabelId = null;
    private String currentCategory = "inbox";
    private final int POLL_INTERVAL_MS = 4000;
    private enum ViewMode { CATEGORY, LABEL }
    private final Handler handler = new Handler();
    private static final int PICK_IMAGE_REQUEST = 101;
    private ViewMode currentViewMode = ViewMode.CATEGORY;

    private List<Label> latestLabels = new ArrayList<>();
    private final Map<Integer, String> labelMenuMap = new HashMap<>();
    private int nextLabelMenuId = 1000;
    private static final int STORAGE_PERMISSION_CODE = 102;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_mails);

        mailViewModel = MyApplication.getInstance().getMailViewModel();
        userViewModel = MyApplication.getInstance().getUserViewModel();
        labelViewModel = MyApplication.getInstance().getLabelViewModel();

        setupRecyclerView();
        setupObservers();
        setupUI();

        mailViewModel.getCurrentUser().observe(this, user -> {
            if (user != null && user.getToken() != null) {
                cachedUser = user;
                labelViewModel.setCurrentUser(user);

                labelViewModel.getLabels().observe(this, labels -> {
                    latestLabels = labels;
                    updateLabelMenu(labels);
                });

                labelViewModel.fetchLabels();
                mailViewModel.fetchMails(currentCategory);
                loadProfileImage(user.getImage());
            }
        });
    }

    private void setupRecyclerView() {
        recyclerView = findViewById(R.id.mailRecyclerView);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));
        adapter = new MailAdapter(this, mailViewModel, userViewModel);
        recyclerView.setAdapter(adapter);
    }

    private void setupObservers() {
        mailViewModel.getMails().observe(this, mails -> {
            adapter.setMails(mails != null ? mails : new ArrayList<>());
            View emptyView = findViewById(R.id.emptyView);
            emptyView.setVisibility(mails == null || mails.isEmpty() ? View.VISIBLE : View.GONE);
        });

        mailViewModel.getErrorMessage().observe(this, msg -> {
            if (msg != null) Toast.makeText(this, msg, Toast.LENGTH_SHORT).show();
        });
    }

    private void setupUI() {
        drawerLayout = findViewById(R.id.drawerLayout);
        navigationView = findViewById(R.id.navigationView);
        navigationView.setCheckedItem(R.id.nav_inbox);

        navigationView.setNavigationItemSelectedListener(item -> {
            if (item.getGroupId() == R.id.group_labels) {
                currentViewMode = ViewMode.LABEL;
                currentLabelId = labelMenuMap.get(item.getItemId());
                isSearching = false;
                mailViewModel.fetchMailsByLabel(currentLabelId);
                drawerLayout.closeDrawers();
                return true;
            }

            int itemId = item.getItemId();

            if (itemId == R.id.nav_starred) {
                currentCategory = "starred";
            } else if (itemId == R.id.nav_sent) {
                currentCategory = "sent";
            } else if (itemId == R.id.nav_drafts) {
                currentCategory = "draft";
            } else if(itemId == R.id.nav_all) {
                currentCategory = "all";
            } else if (itemId == R.id.nav_spam) {
                currentCategory = "spam";
            } else if (itemId == R.id.nav_trash) {
                currentCategory = "trash";
            } else {
                currentCategory = "inbox";
            }

            currentViewMode = ViewMode.CATEGORY;
            isSearching = false;
            mailViewModel.fetchMails(currentCategory);
            drawerLayout.closeDrawers();
            return true;
        });

        ImageView searchIcon = findViewById(R.id.searchIcon);
        EditText searchInput = findViewById(R.id.searchInput);

        if (searchIcon != null && searchInput != null) {
            searchIcon.setOnClickListener(v -> {
                String query = searchInput.getText().toString().trim();
                if (!query.isEmpty()) {
                    isSearching = true;
                    mailViewModel.searchMails(query);
                } else {
                    isSearching = false;
                    mailViewModel.fetchMails(currentCategory);
                }
            });
        }

        View toolbar = findViewById(R.id.searchToolbar);

        if (toolbar != null) {
            ImageView hamb = toolbar.findViewById(R.id.searchHamburger);
            if (hamb != null) hamb.setOnClickListener(v -> drawerLayout.open());

            ImageView prof = toolbar.findViewById(R.id.profileIcon);
            if (prof != null) prof.setOnClickListener(this::showProfileMenu);
        }

        View sendMailButton = findViewById(R.id.sendMailButton);

        if (sendMailButton != null) {
            sendMailButton.setOnClickListener(v ->
                    startActivity(new Intent(MailsActivity.this, MailSendActivity.class))
            );
        }
    }

    private void updateLabelMenu(List<Label> labels) {
        Log.d("DEBUG", "updateLabelMenu called with: " + labels.size() + " labels");

        Menu menu = navigationView.getMenu();
        menu.removeGroup(R.id.group_labels);
        labelMenuMap.clear();
        nextLabelMenuId = 1000;

        int order = 0;

        MenuItem sectionHeader = menu.add(R.id.group_labels, Menu.NONE, order++, "Labels");
        sectionHeader.setEnabled(false);
        sectionHeader.setIcon(R.drawable.ic_label);

        for (Label label : labels) {
            int id = nextLabelMenuId++;
            labelMenuMap.put(id, label.getId());
            menu.add(R.id.group_labels, id, order++, label.getName()).setCheckable(true);
        }

        menu.add(R.id.group_labels, 9998, order++, "Manage Labels")
                .setOnMenuItemClickListener(item -> {
                    showManageLabelsDialog();
                    return true;
                });
    }

    private void showManageLabelsDialog() {
        View dialogView = getLayoutInflater().inflate(R.layout.dialog_manage_labels, null);
        EditText input = dialogView.findViewById(R.id.newLabelInput);
        LinearLayout labelList = dialogView.findViewById(R.id.labelList);

        AlertDialog dialog = new AlertDialog.Builder(this)
                .setTitle("Manage Labels")
                .setView(dialogView)
                .setPositiveButton("Add", null)
                .setNegativeButton("Close", (d, w) -> d.dismiss())
                .create();

        Observer<List<Label>> dialogObserver = labels -> renderLabels(labelList, labels);

        labelViewModel.fetchLabels();
        labelViewModel.getLabels().observe(this, dialogObserver);


        dialog.setOnDismissListener(d -> {
            labelViewModel.getLabels().removeObserver(dialogObserver);
        });

        dialog.setOnShowListener(d -> {
            dialog.getButton(AlertDialog.BUTTON_POSITIVE).setOnClickListener(v -> {
                String newName = input.getText().toString().trim();
                if (newName.isEmpty()) {
                    Toast.makeText(this, "Label name cannot be empty", Toast.LENGTH_SHORT).show();
                    return;
                }

                if (latestLabels.stream().anyMatch(label -> label.getName().equalsIgnoreCase(newName))) {
                    Toast.makeText(this, "Label with this name already exists", Toast.LENGTH_SHORT).show();
                    return;
                }

                if (cachedUser != null) {
                    Label newLabel = new Label();
                    newLabel.setName(newName);
                    newLabel.setOwner(cachedUser.getId());
                    labelViewModel.addLabel(newLabel);
                    input.setText("");
                } else {
                    Toast.makeText(this, "User not loaded yet", Toast.LENGTH_SHORT).show();
                }
            });
        });

        dialog.show();
    }

    private void renderLabels(LinearLayout labelList, List<Label> labels) {
        labelList.removeAllViews();
        for (Label label : labels) {
            View itemView = getLayoutInflater().inflate(R.layout.item_label_row, null);
            TextView labelName = itemView.findViewById(R.id.labelName);
            ImageView deleteIcon = itemView.findViewById(R.id.deleteLabelIcon);
            ImageView editIcon = itemView.findViewById(R.id.editLabelIcon);

            labelName.setText(label.getName());
            deleteIcon.setOnClickListener(v -> labelViewModel.deleteLabel(label.getId()));
            editIcon.setOnClickListener(v -> showEditLabelDialog(label));

            labelList.addView(itemView);
        }
    }

    private void showEditLabelDialog(Label label) {
        EditText input = new EditText(this);
        input.setText(label.getName());

        new AlertDialog.Builder(this)
                .setTitle("Edit Label")
                .setView(input)
                .setPositiveButton("Save", (dialog, which) -> {
                    String newName = input.getText().toString().trim();
                    if (!newName.isEmpty() && !newName.equals(label.getName())) {
                        label.setName(newName);
                        labelViewModel.updateLabel(label);
                    }
                })
                .setNegativeButton("Cancel", null)
                .show();
    }

    private void loadProfileImage(String imageUrl) {
        ImageView profileIcon = findViewById(R.id.profileIcon);
        if (imageUrl != null && !imageUrl.isEmpty()) {
            String fullImageUrl = "http://10.0.2.2:3000/" + imageUrl.replace("\\", "/").replace(" ", "%20");

            Glide.with(this)
                    .load(fullImageUrl)
                    .placeholder(R.drawable.ic_avatar_placeholder)
                    .error(R.drawable.ic_avatar_placeholder)
                    .circleCrop()
                    .into(profileIcon);
        } else {
            profileIcon.setImageResource(R.drawable.ic_avatar_placeholder);
            mailViewModel.clearSenders();
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if (requestCode == PICK_IMAGE_REQUEST && resultCode == RESULT_OK && data != null && data.getData() != null) {
            Uri imageUri = data.getData();
            if (cachedUser != null && cachedUser.getToken() != null) {
                UserViewModel userViewModel = new ViewModelProvider(this).get(UserViewModel.class);
                userViewModel.uploadProfileImage(this, cachedUser.getToken(), imageUri, cachedUser);

                userViewModel.getCurrentUser().observe(this, updatedUser -> {
                    if (updatedUser != null) {
                        cachedUser = updatedUser;
                        loadProfileImage(updatedUser.getImage());
                        mailViewModel.clearSenders();
                        mailViewModel.fetchMails(currentCategory);
                    }
                });
            } else {
                Toast.makeText(this, "User or token not loaded", Toast.LENGTH_SHORT).show();
            }
        }
    }

    private void showProfileMenu(View anchor) {
        PopupMenu popupMenu = new PopupMenu(this, anchor);
        popupMenu.getMenu().add("Sign out").setOnMenuItemClickListener(item -> {
            new Thread(() -> {
                AppDatabase db = AppDatabase.getInstance(getApplicationContext());

                db.userDao().clearAllUsers();
                db.mailDao().clear();
                db.labelDao().clear();

                MyApplication.setToken(null);
                MyApplication.getInstance().getUserViewModel().resetLoginState();

                runOnUiThread(() -> {
                    Intent intent = new Intent(this, LoginActivity.class);
                    intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
                    intent.putExtra("fromLogout", true);
                    startActivity(intent);
                });
            }).start();
            return true;
        });

        popupMenu.getMenu().add("Edit Profile Image").setOnMenuItemClickListener(item -> {
            checkStoragePermissionAndPickImage();
            return true;
        });

        popupMenu.show();
    }

    private void selectImageFromGallery() {
        Intent intent = new Intent(Intent.ACTION_PICK);
        intent.setType("image/*");
        startActivityForResult(intent, PICK_IMAGE_REQUEST);
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == STORAGE_PERMISSION_CODE) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                selectImageFromGallery();
            } else {
                Toast.makeText(this, "Storage permission denied", Toast.LENGTH_SHORT).show();
            }
        }
    }

    private void checkStoragePermissionAndPickImage() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (checkSelfPermission(Manifest.permission.READ_MEDIA_IMAGES) != PackageManager.PERMISSION_GRANTED) {
                requestPermissions(new String[]{Manifest.permission.READ_MEDIA_IMAGES}, STORAGE_PERMISSION_CODE);
                return;
            }
        } else {
            if (checkSelfPermission(Manifest.permission.READ_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED) {
                requestPermissions(new String[]{Manifest.permission.READ_EXTERNAL_STORAGE}, STORAGE_PERMISSION_CODE);
                return;
            }
        }
        selectImageFromGallery();
    }

    @Override
    protected void onResume() {
        super.onResume();
        handler.postDelayed(pollEmailsRunnable, POLL_INTERVAL_MS);
    }

    @Override
    protected void onPause() {
        super.onPause();
        handler.removeCallbacks(pollEmailsRunnable);
    }

    private final Runnable pollEmailsRunnable = new Runnable() {
        @Override
        public void run() {
            if (isSearching) {
                handler.postDelayed(this, POLL_INTERVAL_MS);
                return;
            }
            if (currentViewMode == ViewMode.LABEL && currentLabelId != null) {
                mailViewModel.fetchMailsByLabel(currentLabelId);
            } else {
                mailViewModel.fetchMails(currentCategory);
            }
            handler.postDelayed(this, POLL_INTERVAL_MS);
        }
    };
}