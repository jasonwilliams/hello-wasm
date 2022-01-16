use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn greeting() -> String {
    String::from("Hello world (from Rust!!)")
}
