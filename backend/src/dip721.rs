use super::*;

pub trait DIP721Interface {
    fn dip721_name() -> String;
    fn dip721_symbol() -> String;
    fn dip721_logo() -> Option<String>;
    fn dip721_total_supply() -> u64;
    fn dip721_balance_of(owner: Principal) -> u64;
    fn dip721_owner_of(token_id: u64) -> Option<Principal>;
    fn dip721_token_metadata(token_id: u64) -> Option<LandParcelMetadata>;
    fn dip721_supported_interfaces() -> Vec<String>;
    fn dip721_transfer_from(from: Principal, to: Principal, token_id: u64) -> Result<(), String>;
    fn dip721_approve(approved: Principal, token_id: u64) -> Result<(), String>;
    fn dip721_get_approved(token_id: u64) -> Option<Principal>;
}

