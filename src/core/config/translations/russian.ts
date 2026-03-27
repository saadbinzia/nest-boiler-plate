const russianTranslations = {
  success: {
    // General messages
    default: "Операция выполнена успешно.",
    data_fetched: "Данные успешно получены.",
    data_deleted: "Данные успешно удалены.",
    form_submitted: "Форма успешно отправлена.",

    // Registration messages
    user_registered: "Пользователь успешно зарегистрирован.",
    registration_code_sent_again: "Код успешно отправлен повторно.",

    // Auth messages
    user_login: "Пользователь успешно вошел в систему.",
    session_created: "Сессия успешно создана.",
    logout_from_device: "Выход с устройства выполнен успешно.",
    logout_from_all_devices: "Выход со всех устройств выполнен успешно.",
    auth_code_verified: "Код успешно проверен.",
    password_reset: "Пароль успешно сброшен.",
    password_changed_successfully: "Пароль успешно изменен.",

    // User messages
    user_created: "Пользователь успешно создан.",
    user_found: "Пользователь успешно найден.",
    user_updated: "Пользователь успешно обновлен.",

    // Email messages
    email_sent: "Письмо отправлено на указанный вами email",

    // Forgot password messages
    forgot_code_verified: "Код успешно проверен.",
    password_resetted: "Пароль успешно сброшен.",

    // Legacy
    action_success: "{input} {action} успешно.",

    //Default
    record_saved: "Запись/и успешно сохранены",
    record_updated: "Запись/и успешно обновлены",
    record_deleted: "Запись/и успешно удалены",
    record_fetched: "Запись/и успешно получены",

    // Attachment messages
    attachment_removed: "Вложение успешно удалено.",

    // User Profile Settings
    image_uploaded: "Изображение успешно загружено.",
    image_deleted: "Изображение успешно удалено.",
    subscription_cancelled: "Ваша подписка была успешно отменена.",
    subscription_updated: "Ваша подписка была успешно обновлена",
    plan_created: "Новый план подписки был создан.",
    subscription_upgraded: "Ваша подписка была успешно обновлена",
    space_availability_checked: "Доступность помещения успешно проверена",
    space_leases_found: "Активные аренды успешно получены",
  },
  error: {
    // General messages
    default:
      "Упс! Что-то пошло не так. Если проблема сохраняется, обратитесь к администратору.",
    user_not_linked_with_app:
      "Ваш аккаунт не связан с ProjectNameHere, пожалуйста, зарегистрируйтесь для продолжения.",
    database_error: "Произошла ошибка базы данных.",
    verification_code_expired: "Этот код проверки истек!",
    invalid_verification_code: "Предоставлен неверный код.",
    invalid_cron_key: "Предоставлен неверный ключ.",
    file_not_found: "Файл не найден.",

    // Auth messages
    invalid_user_credentials: "Предоставлены неверные учетные данные.",
    email_not_registered:
      "Email не зарегистрирован. Пожалуйста, зарегистрируйтесь для продолжения.",
    invalid_user_details: "Предоставлены неверные данные.",
    device_not_found: "Устройство не найдено.",
    forgot_code_expired: "Код истек.",
    invalid_forgot_code: "Предоставлен неверный код.",
    code_already_verified: "Код уже проверен.",

    // User message
    user_not_found: "Пользователь не найден.",
    email_already_exists:
      "Этот email уже существует. Пожалуйста, выберите уникальный email.",
    user_already_verified: "Пользователь уже проверен.",
    phone_number_already_exists: "Номер телефона уже существует.",
    phone_number_is_missing: "Номер телефона отсутствует.",
    old_and_new_password_are_same: "Старый и новый пароль одинаковые.",
    old_password_invalid: "Старый пароль неверный.",

    // Legacy
    invalid: "Предоставлен неверный {input}.",
    not_found: "{input} не найден.",
    exists: "{input} уже существует.",
    expired: "{input} истек.",
    already_exists:
      "Этот {input} уже существует. Пожалуйста, выберите уникальный {input}.",
    action_failed: "{input} {action} не удалось.",

    //Default
    record_save_error: "Ошибка при сохранении записи/ей",
    record_update_error: "Ошибка при обновлении записи/ей",
    record_delete_error: "Ошибка при удалении записи/ей",
    record_fetch_error: "Ошибка при получении записи/ей",
    record_not_found: "Запись не найдена!",

    // Attachment messages
    attachment_not_created: "Создание вложения не удалось.",
    attachment_not_deleted: "Удаление вложения не удалось.",
    attachment_not_found: "Вложение не найдено.",

    one_or_more_email_invalid: "Один или несколько email неверны.",
    file_type_not_supported: "Тип файла не поддерживается.",
    file_not_uploaded: "Файл не загружен.",
    user_not_verified: "Пользователь не проверен.",
    channel_with_title_exists: "Канал с таким названием уже существует.",
    channel_not_found: "Указанный канал не существует.",
    file_type_not_image: "Файл должен быть изображением.",
    file_size_exceeds: "Размер файла превышает",
    code_not_provided: "Должен быть предоставлен либо код, либо uuid",
    video_already_linked: "Это видео уже связано с выбранным каналом.",
    file_type_not_mp4: "Файл должен быть mp4.",
    stripe_issue:
      "У нас проблемы с обработкой вашего платежа прямо сейчас. Пожалуйста, попробуйте еще раз через несколько минут",
    no_subscription_found: "Активная подписка не найдена.",
    stripe_change_plan_issue: "У нас проблемы со stripe. Попробуйте позже.",
    stripe_unavailable: "У нас проблемы со stripe. Попробуйте позже.",
    playlist_with_title_exists: "Плейлист с таким названием уже существует.",
    playlist_not_found: "Указанный плейлист не существует.",
    proration_invoice_unpaid: "Обновление вашего плана не было успешным.",
    video_url_not_found: "URL видео не найден.",
    download_failed: "Загрузка не удалась.",
    error_updating_user_videos: "Ошибка обновления видео пользователя.",
    profile_image_not_found: "Изображение профиля не найдено.",

    // Space and lease messages
    space_not_available_for_period:
      "Это помещение недоступно для выбранного периода. Пожалуйста, выберите другие даты или выберите другое помещение.",
    tenant_not_found: "Выбранный арендатор не найден.",
    space_already_occupied: "Это помещение уже занято в выбранный период.",
  },
  unVerifiedUser: {
    user_not_verified: "Пользователь не проверен.",
  },
};

export default russianTranslations;
