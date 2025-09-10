const spanishTranslations = {
  success: {
    // General messages
    default: "Operation completed successfully.",
    data_fetched: "Data fetched successfully.",
    data_deleted: "Data deleted successfully.",
    form_submitted: "Form submitted successfully.",

    // Registration messages
    user_registered: "User registered successfully.",
    registration_code_sent_again: "Code sent again successfully.",

    // Auth messages
    user_login: "User login successfully.",
    session_created: "Session created successfully.",
    logout_from_device: "Logout from device successfully.",
    logout_from_all_devices: "Logout from all devices successfully.",
    auth_code_verified: "Code verified successfully.",
    password_reset: "Password reset successfully.",
    password_changed_successfully: "Password changed successfully.",

    // User messages
    user_created: "User created successfully.",
    user_found: "User found successfully.",
    user_updated: "User updated successfully.",

    // Email messages
    email_sent: "Email has been sent to the email you provided",

    // Forgot password messages
    forgot_code_verified: "Code verified successfully.",
    password_resetted: "Password reset successfully.",

    // Legacy
    action_success: "{input} {action} successfully.",

    //Default
    record_saved: "Record/s successfully saved",
    record_updated: "Record/s successfully updated",
    record_deleted: "Record/s successfully deleted",
    record_fetched: "Record/s successfully retrieved",

    // Attachment messages
    attachment_removed: "Attachment deleted successfully.",

    // User Profile Settings
    image_uploaded: "Image uploaded successfully.",
    image_deleted: "Image deleted successfully.",
    subscription_cancelled:
      "Your subscription has been cancelled successfully.",
    subscription_updated: "Your subscription has been updated successfully",
    plan_created: "New subscription plan has been created.",
    subscription_upgraded: "Your subscription has been upgraded successfully",
  },
  error: {
    // General messages
    default:
      "Oops! Something went wrong. If the issue persists, please contact the administrator.",
    user_not_linked_with_app:
      "Your account is not linked with ProjectNameHere, Please sign up to proceed.",
    database_error: "Database error occurred.",
    verification_code_expired: "This verification code is expired!",
    invalid_verification_code: "Invalid code provided.",
    invalid_cron_key: "Invalid key provided.",
    file_not_found: "File not found.",

    // Auth messages
    invalid_user_credentials: "Invalid credentials provided.",
    email_not_registered: "Email not registered. Please register to proceed.",
    invalid_user_details: "Invalid details provided.",
    device_not_found: "Device not found.",
    forgot_code_expired: "The code expired.",
    invalid_forgot_code: "Invalid code provided.",
    code_already_verified: "Code already verified.",

    // User message
    user_not_found: "User not found.",
    email_already_exists:
      "This email already exists. Please choose a unique email.",
    user_already_verified: "User is already verified.",
    phone_number_already_exists: "Phone number already exists.",
    phone_number_is_missing: "Phone number is missing.",
    old_and_new_password_are_same: "Old and new password are same.",
    old_password_invalid: "Old password is invalid.",

    // Legacy
    invalid: "Invalid {input} provided.",
    not_found: "{input} not found.",
    exists: "{input} already exists.",
    expired: "{input} has been expired.",
    already_exists:
      "This {input} already exists. Please choose a unique {input}.",
    action_failed: "{input} {action} failed.",

    //Default
    record_save_error: "Record/s save time getting an error",
    record_update_error: "Record/s update time getting an error",
    record_delete_error: "Record/s delete time getting an error",
    record_fetch_error: "Record/s retrieving time getting an error",
    record_not_found: "Record not found!",

    // Attachment messages
    attachment_not_created: "Attachment creation failed.",
    attachment_not_deleted: "Attachment deletion failed.",
    attachment_not_found: "Attachment not found.",
    one_or_more_email_invalid: "One or more email is invalid.",
    file_type_not_supported: "File type not supported.",
    file_not_uploaded: "File not uploaded.",
    user_not_verified: "User is not verified.",
    channel_with_title_exists: "Channel with this title already exists.",
    channel_not_found: "The specified channel does not exists.",
    file_type_not_image: "File should be image.",
    file_size_exceeds: "File size exceeds",
    code_not_provided: "Either code or uuid must be provided",
    video_already_linked:
      "This video is already linked to the selected channel.",
    file_type_not_mp4: "File should be mp4.",
    stripe_issue:
      "We're experiencing issues processing your payment right now. Please try again in a few minutes",
    no_subscription_found: "No active subscription has been found.",
    stripe_change_plan_issue:
      "We're experiencing issues with stripe. Try again later.",
    stripe_unavailable:
      "We're experiencing issues with stripe. Try again later.",
    playlist_with_title_exists: "Playlist with this title already exists.",
    playlist_not_found: "The specified playlist does not exists.",
    proration_invoice_unpaid: "Your plan upgrade was not successful.",
    video_url_not_found: "Video url not found.",
    download_failed: "Download failed.",
  },
  unVerifiedUser: {
    user_not_verified: "User is not verified.",
  },
};

export default spanishTranslations;
