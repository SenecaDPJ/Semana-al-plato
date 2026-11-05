#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![export_backup])
        .setup(|app| {
            #[cfg(target_os = "windows")]
            place_main_window(app)?;
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("No se pudo iniciar el calendario");
}

#[tauri::command]
async fn export_backup(app: tauri::AppHandle, json: String) -> Result<bool, String> {
    use tauri_plugin_dialog::DialogExt;

    let selected = app
        .dialog()
        .file()
        .set_title("Guardar copia de Semana al Plato")
        .set_file_name("Semana_al_Plato_copia.json")
        .add_filter("Copia JSON", &["json"])
        .blocking_save_file();
    let Some(selected) = selected else { return Ok(false) };
    let path = selected.into_path().map_err(|e| e.to_string())?;
    std::fs::write(path, json).map_err(|e| e.to_string())?;
    Ok(true)
}

#[cfg(target_os = "windows")]
fn place_main_window(app: &tauri::App) -> Result<(), Box<dyn std::error::Error>> {
    use tauri::{Manager, PhysicalPosition, PhysicalSize};
    use windows_sys::Win32::Foundation::POINT;
    use windows_sys::Win32::Graphics::Gdi::{
        GetMonitorInfoW, MonitorFromPoint, MONITORINFO, MONITOR_DEFAULTTOPRIMARY,
    };

    let window = app
        .get_webview_window("main")
        .ok_or("No se encontró la ventana principal")?;
    let monitor = unsafe {
        MonitorFromPoint(POINT { x: 0, y: 0 }, MONITOR_DEFAULTTOPRIMARY)
    };
    if monitor.is_null() {
        return Err("No se encontró la pantalla principal".into());
    }

    let mut info = MONITORINFO {
        cbSize: std::mem::size_of::<MONITORINFO>() as u32,
        rcMonitor: Default::default(),
        rcWork: Default::default(),
        dwFlags: 0,
    };
    if unsafe { GetMonitorInfoW(monitor, &mut info) } == 0 {
        return Err("No se pudo consultar el área de trabajo de Windows".into());
    }

    let scale = window.scale_factor()?;
    let width = (1400.0 * scale).round() as i32;
    let work_height = info.rcWork.bottom - info.rcWork.top;
    // set_size recibe el tamaño interior. Reservamos también el marco y la barra de título.
    let outer = window.outer_size()?;
    let inner = window.inner_size()?;
    let chrome_height = outer.height.saturating_sub(inner.height) as i32;
    let chrome_width = outer.width.saturating_sub(inner.width) as i32;
    let height = (work_height - chrome_height - 8).max(1) as u32;
    let x = (info.rcWork.right - width - chrome_width).max(info.rcWork.left);
    window.set_size(PhysicalSize::new(width as u32, height))?;
    window.set_position(PhysicalPosition::new(x, info.rcWork.top))?;
    Ok(())
}
