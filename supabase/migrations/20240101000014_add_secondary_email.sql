-- Update player_info email to include secondary email
update player_info
set email = 'gentlegentlemoon@gmail.com / sofwan@rihlasoccer.com'
where email = 'gentlegentlemoon@gmail.com' or email like 'gentlegentlemoon@gmail.com%';
