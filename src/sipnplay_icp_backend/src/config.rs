use serde::Deserialize;
use std::fs;

#[derive(Deserialize)]
struct Config {
    secret_key: String,
}

pub fn get_secret_key() -> String {
    let config_content = fs::read_to_string("config.yaml").expect("Failed to read config.yaml");
    let config: Config = serde_yaml::from_str(&config_content).expect("Failed to parse config.yaml");
    config.secret_key
}