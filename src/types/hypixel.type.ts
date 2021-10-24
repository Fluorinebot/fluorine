export interface HypixelType {
	success: boolean;
	player: Player;
}

export interface Player {
	_id: string;
	uuid: string;
	displayname: string;
	firstLogin: number;
	knownAliases: string[];
	knownAliasesLower: string[];
	lastLogin: number;
	playername: string;
	achievementsOneTime: string[];
	achievementTracking: any[];
	achievementSync: AchievementSync;
	stats: Stats;
	achievementPoints: number;
	achievements: { [key: string]: number };
	lastLogout: number;
	challenges: Challenges;
	networkExp: number;
	karma: number;
	levelingReward_0: boolean;
	parkourCheckpointBests: ParkourCheckpointBests;
	parkourCompletions: ParkourCompletions;
	achievementRewardsNew: { [key: string]: number };
	levelingReward_1: boolean;
	levelingReward_3: boolean;
	levelingReward_2: boolean;
	petConsumables: { [key: string]: number };
	vanityMeta: VanityMeta;
	monthlycrates: { [key: string]: Monthlycrate };
	lastAdsenseGenerateTime: number;
	friendRequestsUuid: any[];
	channel: string;
	levelingReward_4: boolean;
	levelingReward_5: boolean;
	levelingReward_6: boolean;
	levelingReward_7: boolean;
	levelingReward_8: boolean;
	levelingReward_9: boolean;
	outfit: Outfit;
	levelingReward_10: boolean;
	levelingReward_11: boolean;
	housingMeta: HousingMeta;
	levelingReward_12: boolean;
	levelingReward_13: boolean;
	levelingReward_14: boolean;
	levelingReward_15: boolean;
	levelingReward_16: boolean;
	levelingReward_17: boolean;
	levelingReward_18: boolean;
	levelingReward_20: boolean;
	levelingReward_19: boolean;
	levelingReward_21: boolean;
	levelingReward_22: boolean;
	levelingReward_23: boolean;
	skyblock_free_cookie: number;
	levelingReward_24: boolean;
	mostRecentGameType: string;
}

export interface AchievementSync {
	quake_tiered: number;
}

export interface Challenges {
	all_time: { [key: string]: number };
	day_e: DayE;
	day_f: Day;
	day_g: Day;
	day_h: Day;
	day_i: DayI;
}

export interface DayE {
	SKYWARS__feeding_the_void_challenge: number;
}

export interface Day {
	SKYWARS__feeding_the_void_challenge: number;
	SKYWARS__rush_challenge: number;
}

export interface DayI {
	SKYWARS__rush_challenge: number;
}

export interface HousingMeta {
	given_cookies_105117: string[];
}

export interface Monthlycrate {
	REGULAR: boolean;
}

export interface Outfit {
	BOOTS: string;
}

export interface ParkourCheckpointBests {
	Duels: { [key: string]: number };
	Bedwars: { [key: string]: number };
	Prototype: { [key: string]: number };
}

export interface ParkourCompletions {
	Duels: Bedwar[];
	Bedwars: Bedwar[];
}

export interface Bedwar {
	timeStart: number;
	timeTook: number;
}

export interface Stats {
	Quake?: Paintball;
	VampireZ?: VampireZ;
	Paintball?: Paintball;
	GingerBread?: GingerBread;
	Arcade?: Arcade;
	SkyWars?: SkyWars;
	Pit?: Pit;
	Bedwars?: Bedwars;
	TNTGames?: TNTGames;
	Duels?: Duels;
	SuperSmash?: SuperSmash;
	UHC?: Uhc;
	HungerGames?: HungerGames;
	Walls3?: Arena;
	MCGO?: Mcgo;
	Arena?: Arena;
	Walls?: Arena;
	Battleground?: Battleground;
	SkyBlock?: SkyBlock;
	BuildBattle?: BuildBattle;
	Legacy?: Legacy;
}

export interface Arcade {
	hitw_record_q: number;
	hitw_record_f: number;
	coins: number;
	rounds_hole_in_the_wall: number;
	lastTourneyAd: number;
	wins_party: number;
	candy_found_halloween_simulator: number;
}

export interface Arena {
	coins: number;
}

export interface Battleground {
	coins: number;
	packages: string[];
	mage_spec: string;
	paladin_spec: string;
	selected_mount: string;
	chosen_class: string;
	shaman_spec: string;
	warrior_spec: string;
}

export interface Bedwars {
	bedwars_boxes: number;
	Experience: number;
	first_join_7: boolean;
	games_played_bedwars_1: number;
	eight_two_winstreak: number;
	_items_purchased_bedwars: number;
	beds_lost_bedwars: number;
	coins: number;
	deaths_bedwars: number;
	eight_two__items_purchased_bedwars: number;
	eight_two_beds_lost_bedwars: number;
	eight_two_deaths_bedwars: number;
	eight_two_entity_attack_deaths_bedwars: number;
	eight_two_entity_attack_final_deaths_bedwars: number;
	eight_two_entity_attack_kills_bedwars: number;
	eight_two_final_deaths_bedwars: number;
	eight_two_games_played_bedwars: number;
	eight_two_gold_resources_collected_bedwars: number;
	eight_two_iron_resources_collected_bedwars: number;
	eight_two_items_purchased_bedwars: number;
	eight_two_kills_bedwars: number;
	eight_two_losses_bedwars: number;
	eight_two_resources_collected_bedwars: number;
	entity_attack_deaths_bedwars: number;
	entity_attack_final_deaths_bedwars: number;
	entity_attack_kills_bedwars: number;
	final_deaths_bedwars: number;
	games_played_bedwars: number;
	gold_resources_collected_bedwars: number;
	iron_resources_collected_bedwars: number;
	items_purchased_bedwars: number;
	kills_bedwars: number;
	losses_bedwars: number;
	resources_collected_bedwars: number;
	winstreak: number;
	four_three_winstreak: number;
	diamond_resources_collected_bedwars: number;
	final_kills_bedwars: number;
	four_three__items_purchased_bedwars: number;
	four_three_deaths_bedwars: number;
	four_three_diamond_resources_collected_bedwars: number;
	four_three_entity_attack_deaths_bedwars: number;
	four_three_final_kills_bedwars: number;
	four_three_games_played_bedwars: number;
	four_three_gold_resources_collected_bedwars: number;
	four_three_iron_resources_collected_bedwars: number;
	four_three_items_purchased_bedwars: number;
	four_three_resources_collected_bedwars: number;
	four_three_void_deaths_bedwars: number;
	four_three_void_final_kills_bedwars: number;
	four_three_wins_bedwars: number;
	void_deaths_bedwars: number;
	void_final_kills_bedwars: number;
	wins_bedwars: number;
	four_three_beds_lost_bedwars: number;
	four_three_entity_attack_kills_bedwars: number;
	four_three_final_deaths_bedwars: number;
	four_three_kills_bedwars: number;
	four_three_losses_bedwars: number;
	four_three_void_final_deaths_bedwars: number;
	four_three_void_kills_bedwars: number;
	void_final_deaths_bedwars: number;
	void_kills_bedwars: number;
	four_four_winstreak: number;
	four_four__items_purchased_bedwars: number;
	four_four_beds_lost_bedwars: number;
	four_four_deaths_bedwars: number;
	four_four_entity_attack_deaths_bedwars: number;
	four_four_entity_attack_final_deaths_bedwars: number;
	four_four_entity_attack_kills_bedwars: number;
	four_four_final_deaths_bedwars: number;
	four_four_games_played_bedwars: number;
	four_four_gold_resources_collected_bedwars: number;
	four_four_iron_resources_collected_bedwars: number;
	four_four_items_purchased_bedwars: number;
	four_four_kills_bedwars: number;
	four_four_losses_bedwars: number;
	four_four_resources_collected_bedwars: number;
	four_four_void_deaths_bedwars: number;
	four_four_void_kills_bedwars: number;
	beds_broken_bedwars: number;
	entity_attack_final_kills_bedwars: number;
	four_four_beds_broken_bedwars: number;
	four_four_diamond_resources_collected_bedwars: number;
	four_four_entity_attack_final_kills_bedwars: number;
	four_four_final_kills_bedwars: number;
	four_four_void_final_kills_bedwars: number;
	eight_two_fall_kills_bedwars: number;
	eight_two_void_deaths_bedwars: number;
	eight_two_void_final_deaths_bedwars: number;
	eight_two_void_kills_bedwars: number;
	fall_kills_bedwars: number;
	eight_two_beds_broken_bedwars: number;
	eight_two_entity_attack_final_kills_bedwars: number;
	eight_two_final_kills_bedwars: number;
	eight_two_emerald_resources_collected_bedwars: number;
	eight_two_fall_deaths_bedwars: number;
	eight_two_void_final_kills_bedwars: number;
	emerald_resources_collected_bedwars: number;
	fall_deaths_bedwars: number;
	eight_two_diamond_resources_collected_bedwars: number;
	eight_two_fall_final_deaths_bedwars: number;
	fall_final_deaths_bedwars: number;
	eight_two_permanent_items_purchased_bedwars: number;
	eight_two_wins_bedwars: number;
	permanent_items_purchased_bedwars: number;
	eight_two_magic_deaths_bedwars: number;
	magic_deaths_bedwars: number;
	eight_two_magic_final_deaths_bedwars: number;
	magic_final_deaths_bedwars: number;
	four_three_magic_final_deaths_bedwars: number;
	four_three_entity_attack_final_deaths_bedwars: number;
	four_four_emerald_resources_collected_bedwars: number;
	four_four_void_final_deaths_bedwars: number;
	favourites_2: string;
	packages: string[];
	practice: Practice;
	eight_two_entity_explosion_kills_bedwars: number;
	entity_explosion_kills_bedwars: number;
	eight_two_fire_tick_deaths_bedwars: number;
	eight_two_fire_tick_final_kills_bedwars: number;
	fire_tick_deaths_bedwars: number;
	fire_tick_final_kills_bedwars: number;
	eight_two_magic_final_kills_bedwars: number;
	magic_final_kills_bedwars: number;
	bedwars_easter_boxes: number;
	eight_two_entity_explosion_final_deaths_bedwars: number;
	entity_explosion_final_deaths_bedwars: number;
	four_four_magic_kills_bedwars: number;
	four_four_permanent_items_purchased_bedwars: number;
	four_four_wins_bedwars: number;
	magic_kills_bedwars: number;
	four_four_fall_deaths_bedwars: number;
	four_four_magic_deaths_bedwars: number;
	four_three_beds_broken_bedwars: number;
	four_three_emerald_resources_collected_bedwars: number;
	four_three_entity_attack_final_kills_bedwars: number;
	four_three_permanent_items_purchased_bedwars: number;
	four_three_magic_final_kills_bedwars: number;
	eight_one_winstreak: number;
	eight_one__items_purchased_bedwars: number;
	eight_one_beds_broken_bedwars: number;
	eight_one_deaths_bedwars: number;
	eight_one_entity_attack_deaths_bedwars: number;
	eight_one_entity_attack_final_kills_bedwars: number;
	eight_one_final_kills_bedwars: number;
	eight_one_games_played_bedwars: number;
	eight_one_gold_resources_collected_bedwars: number;
	eight_one_iron_resources_collected_bedwars: number;
	eight_one_items_purchased_bedwars: number;
	eight_one_kills_bedwars: number;
	eight_one_magic_kills_bedwars: number;
	eight_one_permanent_items_purchased_bedwars: number;
	eight_one_resources_collected_bedwars: number;
	eight_one_void_deaths_bedwars: number;
	eight_one_void_final_kills_bedwars: number;
	eight_one_void_kills_bedwars: number;
	eight_one_wins_bedwars: number;
	eight_one_entity_attack_kills_bedwars: number;
	eight_one_beds_lost_bedwars: number;
	eight_one_entity_attack_final_deaths_bedwars: number;
	eight_one_final_deaths_bedwars: number;
	eight_one_losses_bedwars: number;
	eight_one_emerald_resources_collected_bedwars: number;
	eight_one_magic_deaths_bedwars: number;
	eight_one_void_final_deaths_bedwars: number;
	eight_one_diamond_resources_collected_bedwars: number;
	eight_one_magic_final_kills_bedwars: number;
	eight_one_fire_tick_kills_bedwars: number;
	fire_tick_kills_bedwars: number;
	eight_one_entity_explosion_deaths_bedwars: number;
	eight_one_fall_deaths_bedwars: number;
	entity_explosion_deaths_bedwars: number;
	eight_one_magic_final_deaths_bedwars: number;
	eight_one_entity_explosion_final_deaths_bedwars: number;
	eight_one_fall_kills_bedwars: number;
	activeKillMessages: string;
	eight_two_fall_final_kills_bedwars: number;
	fall_final_kills_bedwars: number;
	favorite_slots: string;
	eight_two_fire_tick_kills_bedwars: number;
	eight_two_magic_kills_bedwars: number;
	eight_two_entity_explosion_deaths_bedwars: number;
	eight_one_fall_final_kills_bedwars: number;
	eight_two_fire_tick_final_deaths_bedwars: number;
	fire_tick_final_deaths_bedwars: number;
	eight_one_fire_tick_deaths_bedwars: number;
	eight_one_entity_explosion_final_kills_bedwars: number;
	entity_explosion_final_kills_bedwars: number;
	eight_two_armed_winstreak: number;
	eight_two_armed__items_purchased_bedwars: number;
	eight_two_armed_beds_lost_bedwars: number;
	eight_two_armed_deaths_bedwars: number;
	eight_two_armed_entity_attack_deaths_bedwars: number;
	eight_two_armed_entity_attack_kills_bedwars: number;
	eight_two_armed_final_deaths_bedwars: number;
	eight_two_armed_final_kills_bedwars: number;
	eight_two_armed_games_played_bedwars: number;
	eight_two_armed_gold_resources_collected_bedwars: number;
	eight_two_armed_iron_resources_collected_bedwars: number;
	eight_two_armed_items_purchased_bedwars: number;
	eight_two_armed_kills_bedwars: number;
	eight_two_armed_losses_bedwars: number;
	eight_two_armed_projectile_deaths_bedwars: number;
	eight_two_armed_projectile_final_deaths_bedwars: number;
	eight_two_armed_projectile_final_kills_bedwars: number;
	eight_two_armed_projectile_kills_bedwars: number;
	eight_two_armed_resources_collected_bedwars: number;
	eight_two_armed_void_deaths_bedwars: number;
	eight_two_armed_void_kills_bedwars: number;
	eight_two_armed_entity_explosion_deaths_bedwars: number;
	eight_two_armed_permanent_items_purchased_bedwars: number;
	eight_two_armed_wins_bedwars: number;
	two_four_winstreak: number;
	two_four__items_purchased_bedwars: number;
	two_four_deaths_bedwars: number;
	two_four_entity_attack_deaths_bedwars: number;
	two_four_entity_attack_final_kills_bedwars: number;
	two_four_entity_attack_kills_bedwars: number;
	two_four_fall_deaths_bedwars: number;
	two_four_final_kills_bedwars: number;
	two_four_games_played_bedwars: number;
	two_four_gold_resources_collected_bedwars: number;
	two_four_iron_resources_collected_bedwars: number;
	two_four_items_purchased_bedwars: number;
	two_four_kills_bedwars: number;
	two_four_permanent_items_purchased_bedwars: number;
	two_four_resources_collected_bedwars: number;
	two_four_void_deaths_bedwars: number;
	two_four_void_kills_bedwars: number;
	two_four_wins_bedwars: number;
	four_three_fall_deaths_bedwars: number;
	four_three_fire_tick_deaths_bedwars: number;
	eight_two_rush_winstreak: number;
	eight_two_rush__items_purchased_bedwars: number;
	eight_two_rush_beds_broken_bedwars: number;
	eight_two_rush_beds_lost_bedwars: number;
	eight_two_rush_deaths_bedwars: number;
	eight_two_rush_emerald_resources_collected_bedwars: number;
	eight_two_rush_entity_attack_final_deaths_bedwars: number;
	eight_two_rush_final_deaths_bedwars: number;
	eight_two_rush_games_played_bedwars: number;
	eight_two_rush_gold_resources_collected_bedwars: number;
	eight_two_rush_iron_resources_collected_bedwars: number;
	eight_two_rush_items_purchased_bedwars: number;
	eight_two_rush_losses_bedwars: number;
	eight_two_rush_resources_collected_bedwars: number;
	eight_two_rush_void_deaths_bedwars: number;
	eight_two_rush_entity_attack_kills_bedwars: number;
	eight_two_rush_kills_bedwars: number;
	eight_two_rush_magic_final_deaths_bedwars: number;
	eight_two_rush_entity_attack_deaths_bedwars: number;
	eight_two_rush_final_kills_bedwars: number;
	eight_two_rush_void_final_kills_bedwars: number;
	eight_two_rush_void_kills_bedwars: number;
	eight_two_rush_void_final_deaths_bedwars: number;
	eight_one_entity_explosion_kills_bedwars: number;
	eight_one_projectile_deaths_bedwars: number;
	projectile_deaths_bedwars: number;
	selected_ultimate: string;
	eight_two_ultimate_winstreak: number;
	eight_two_ultimate__items_purchased_bedwars: number;
	eight_two_ultimate_beds_broken_bedwars: number;
	eight_two_ultimate_beds_lost_bedwars: number;
	eight_two_ultimate_emerald_resources_collected_bedwars: number;
	eight_two_ultimate_entity_attack_final_deaths_bedwars: number;
	eight_two_ultimate_entity_attack_kills_bedwars: number;
	eight_two_ultimate_final_deaths_bedwars: number;
	eight_two_ultimate_games_played_bedwars: number;
	eight_two_ultimate_gold_resources_collected_bedwars: number;
	eight_two_ultimate_iron_resources_collected_bedwars: number;
	eight_two_ultimate_items_purchased_bedwars: number;
	eight_two_ultimate_kills_bedwars: number;
	eight_two_ultimate_losses_bedwars: number;
	eight_two_ultimate_resources_collected_bedwars: number;
	eight_two_ultimate_deaths_bedwars: number;
	eight_two_ultimate_entity_attack_deaths_bedwars: number;
	eight_two_ultimate_final_kills_bedwars: number;
	eight_two_ultimate_void_deaths_bedwars: number;
	eight_two_ultimate_void_final_kills_bedwars: number;
	eight_two_ultimate_wins_bedwars: number;
	eight_two_ultimate_void_final_deaths_bedwars: number;
	eight_two_ultimate_void_kills_bedwars: number;
	eight_two_ultimate_permanent_items_purchased_bedwars: number;
	eight_two_ultimate_entity_attack_final_kills_bedwars: number;
	eight_two_ultimate_magic_final_kills_bedwars: number;
	understands_resource_bank: boolean;
	understands_streaks: boolean;
	castle__items_purchased_bedwars: number;
	castle_beds_lost_bedwars: number;
	castle_deaths_bedwars: number;
	castle_entity_attack_final_deaths_bedwars: number;
	castle_final_deaths_bedwars: number;
	castle_gold_resources_collected_bedwars: number;
	castle_iron_resources_collected_bedwars: number;
	castle_items_purchased_bedwars: number;
	castle_losses_bedwars: number;
	castle_magic_deaths_bedwars: number;
	castle_resources_collected_bedwars: number;
	castle_void_deaths_bedwars: number;
	castle_winstreak: number;
	activeBedDestroy: string;
	eight_one_fire_kills_bedwars: number;
	fire_kills_bedwars: number;
	eight_two_lucky_winstreak: number;
	eight_two_lucky__items_purchased_bedwars: number;
	eight_two_lucky_beds_lost_bedwars: number;
	eight_two_lucky_deaths_bedwars: number;
	eight_two_lucky_entity_attack_deaths_bedwars: number;
	eight_two_lucky_entity_attack_final_kills_bedwars: number;
	eight_two_lucky_entity_attack_kills_bedwars: number;
	eight_two_lucky_fall_deaths_bedwars: number;
	eight_two_lucky_final_deaths_bedwars: number;
	eight_two_lucky_final_kills_bedwars: number;
	eight_two_lucky_fire_tick_final_deaths_bedwars: number;
	eight_two_lucky_games_played_bedwars: number;
	eight_two_lucky_gold_resources_collected_bedwars: number;
	eight_two_lucky_iron_resources_collected_bedwars: number;
	eight_two_lucky_items_purchased_bedwars: number;
	eight_two_lucky_kills_bedwars: number;
	eight_two_lucky_losses_bedwars: number;
	eight_two_lucky_resources_collected_bedwars: number;
	eight_two_lucky_void_deaths_bedwars: number;
	eight_two_projectile_kills_bedwars: number;
	projectile_kills_bedwars: number;
	eight_two_rush_entity_attack_final_kills_bedwars: number;
	eight_two_rush_fall_final_kills_bedwars: number;
	eight_two_rush_permanent_items_purchased_bedwars: number;
	eight_two_rush_entity_explosion_final_deaths_bedwars: number;
}

export interface Practice {
	selected: string;
	mlg: Bridging;
	fireball_jumping: Bridging;
	bridging: Bridging;
	records: Records;
}

export interface Bridging {
	successful_attempts: number;
	failed_attempts: number;
	blocks_placed: number;
}

export interface Records {
	"bridging_distance_30:elevation_NONE:angle_STRAIGHT:": number;
	"bridging_distance_30:elevation_STAIRCASE:angle_STRAIGHT:": number;
	"bridging_distance_30:elevation_NONE:angle_DIAGONAL:": number;
}

export interface BuildBattle {
	music: boolean;
	coins: number;
	games_played: number;
	monthly_coins_b: number;
	score: number;
	teams_most_points: number;
	total_votes: number;
	weekly_coins_a: number;
}

export interface Duels {
	uhc_rookie_title_prestige: number;
	skywars_rookie_title_prestige: number;
	all_modes_rookie_title_prestige: number;
	blitz_rookie_title_prestige: number;
	mega_walls_rookie_title_prestige: number;
	op_rookie_title_prestige: number;
	bow_rookie_title_prestige: number;
	classic_rookie_title_prestige: number;
	no_debuff_rookie_title_prestige: number;
	tnt_games_rookie_title_prestige: number;
	bridge_rookie_title_prestige: number;
	combo_rookie_title_prestige: number;
	sumo_rookie_title_prestige: number;
	duels_recently_played2: string;
	show_lb_option: string;
	selected_1_new: string;
	selected_2_new: string;
	chat_enabled: string;
	games_played_duels: number;
	current_winstreak_mode_bridge_duel: number;
	bridgeMapWins: string[];
	maps_won_on: string[];
	current_winstreak: number;
	best_overall_winstreak: number;
	best_winstreak_mode_bridge_duel: number;
	current_bridge_winstreak: number;
	best_bridge_winstreak: number;
	blocks_placed: number;
	bow_hits: number;
	bow_shots: number;
	bridge_deaths: number;
	bridge_duel_blocks_placed: number;
	bridge_duel_bow_hits: number;
	bridge_duel_bow_shots: number;
	bridge_duel_bridge_deaths: number;
	bridge_duel_bridge_kills: number;
	bridge_duel_damage_dealt: number;
	bridge_duel_goals: number;
	bridge_duel_health_regenerated: number;
	bridge_duel_melee_hits: number;
	bridge_duel_melee_swings: number;
	bridge_duel_rounds_played: number;
	bridge_duel_wins: number;
	bridge_kills: number;
	coins: number;
	damage_dealt: number;
	goals: number;
	health_regenerated: number;
	melee_hits: number;
	melee_swings: number;
	rounds_played: number;
	wins: number;
	bridge_duel_losses: number;
	losses: number;
	current_winstreak_mode_bridge_four: number;
	bridge_four_blocks_placed: number;
	bridge_four_bow_shots: number;
	bridge_four_bridge_deaths: number;
	bridge_four_damage_dealt: number;
	bridge_four_health_regenerated: number;
	bridge_four_losses: number;
	bridge_four_melee_hits: number;
	bridge_four_melee_swings: number;
	bridge_four_rounds_played: number;
	current_classic_winstreak: number;
	current_winstreak_mode_classic_duel: number;
	classic_duel_bow_hits: number;
	classic_duel_bow_shots: number;
	classic_duel_damage_dealt: number;
	classic_duel_deaths: number;
	classic_duel_health_regenerated: number;
	classic_duel_losses: number;
	classic_duel_melee_hits: number;
	classic_duel_melee_swings: number;
	classic_duel_rounds_played: number;
	deaths: number;
	best_winstreak_mode_classic_duel: number;
	best_classic_winstreak: number;
	classic_duel_kills: number;
	classic_duel_wins: number;
	kills: number;
	sw_duels_kit_new3: string;
	current_winstreak_mode_sw_duel: number;
	current_skywars_winstreak: number;
	sw_duel_damage_dealt: number;
	sw_duel_deaths: number;
	sw_duel_health_regenerated: number;
	sw_duel_losses: number;
	sw_duel_melee_hits: number;
	sw_duel_melee_swings: number;
	sw_duel_rounds_played: number;
	best_winstreak_mode_sw_duel: number;
	best_skywars_winstreak: number;
	armorer_kit_wins: number;
	kit_wins: number;
	sw_duel_armorer_kit_wins: number;
	sw_duel_blocks_placed: number;
	sw_duel_kills: number;
	sw_duel_kit_wins: number;
	sw_duel_wins: number;
	athlete_kit_wins: number;
	sw_duel_athlete_kit_wins: number;
	current_winstreak_mode_sw_doubles: number;
	sw_doubles_blocks_placed: number;
	sw_doubles_deaths: number;
	sw_doubles_health_regenerated: number;
	sw_doubles_kills: number;
	sw_doubles_losses: number;
	sw_doubles_melee_swings: number;
	sw_doubles_rounds_played: number;
	leaderboardPage_win_streak: number;
	duels_winstreak_best_sw_duel: number;
	duels_winstreak_best_classic_duel: number;
	current_uhc_winstreak: number;
	current_winstreak_mode_uhc_duel: number;
	golden_apples_eaten: number;
	uhc_duel_damage_dealt: number;
	uhc_duel_deaths: number;
	uhc_duel_golden_apples_eaten: number;
	uhc_duel_health_regenerated: number;
	uhc_duel_losses: number;
	uhc_duel_melee_hits: number;
	uhc_duel_melee_swings: number;
	uhc_duel_rounds_played: number;
	uhc_duel_bow_shots: number;
	best_winstreak_mode_uhc_duel: number;
	best_uhc_winstreak: number;
	uhc_duel_blocks_placed: number;
	uhc_duel_kills: number;
	uhc_duel_wins: number;
	current_no_debuff_winstreak: number;
	current_winstreak_mode_potion_duel: number;
	heal_pots_used: number;
	potion_duel_damage_dealt: number;
	potion_duel_deaths: number;
	potion_duel_heal_pots_used: number;
	potion_duel_health_regenerated: number;
	potion_duel_losses: number;
	potion_duel_melee_hits: number;
	potion_duel_melee_swings: number;
	potion_duel_rounds_played: number;
	sw_duel_bow_hits: number;
	sw_duel_bow_shots: number;
	current_combo_winstreak: number;
	current_winstreak_mode_combo_duel: number;
	best_winstreak_mode_combo_duel: number;
	best_combo_winstreak: number;
	combo_duel_golden_apples_eaten: number;
	combo_duel_health_regenerated: number;
	combo_duel_kills: number;
	combo_duel_melee_hits: number;
	combo_duel_melee_swings: number;
	combo_duel_rounds_played: number;
	combo_duel_wins: number;
	duels_winstreak_best_combo_duel: number;
	combo_duel_deaths: number;
	combo_duel_losses: number;
	packages: string[];
	active_cosmetictitle: string;
	progress_mode: string;
	best_sumo_winstreak: number;
	current_winstreak_mode_sumo_duel: number;
	best_winstreak_mode_sumo_duel: number;
	current_sumo_winstreak: number;
	sumo_duel_kills: number;
	sumo_duel_melee_hits: number;
	sumo_duel_melee_swings: number;
	sumo_duel_rounds_played: number;
	sumo_duel_wins: number;
	sumo_duel_deaths: number;
	sumo_duel_losses: number;
	combo_iron_title_prestige: number;
	best_tnt_games_winstreak: number;
	current_winstreak_mode_bowspleef_duel: number;
	best_winstreak_mode_bowspleef_duel: number;
	current_tnt_games_winstreak: number;
	bowspleef_duel_bow_shots: number;
	bowspleef_duel_rounds_played: number;
	bowspleef_duel_wins: number;
	current_winstreak_mode_bridge_doubles: number;
	bridge_doubles_blocks_placed: number;
	bridge_doubles_bridge_deaths: number;
	bridge_doubles_bridge_kills: number;
	bridge_doubles_damage_dealt: number;
	bridge_doubles_losses: number;
	bridge_doubles_melee_hits: number;
	bridge_doubles_melee_swings: number;
	bridge_doubles_rounds_played: number;
	bridge_doubles_bow_hits: number;
	bridge_doubles_bow_shots: number;
	bridge_doubles_health_regenerated: number;
	bridge_four_bow_hits: number;
	bridge_four_bridge_kills: number;
	rematch_option_1: string;
	kit_menu_option: string;
	uhc_duel_bow_hits: number;
	current_op_winstreak: number;
	current_winstreak_mode_op_duel: number;
	op_duel_damage_dealt: number;
	op_duel_deaths: number;
	op_duel_health_regenerated: number;
	op_duel_losses: number;
	op_duel_melee_hits: number;
	op_duel_melee_swings: number;
	op_duel_rounds_played: number;
	duels_winstreak_best_bowspleef_duel: number;
	bowspleef_duel_deaths: number;
	bowspleef_duel_losses: number;
	bow_duel_bow_hits: number;
	bow_duel_bow_shots: number;
	bow_duel_damage_dealt: number;
	bow_duel_health_regenerated: number;
	bow_duel_rounds_played: number;
	all_modes_iron_title_prestige: number;
	blitz_duels_kit: string;
	current_blitz_winstreak: number;
	current_winstreak_mode_blitz_duel: number;
	blitz_duel_blocks_placed: number;
	blitz_duel_damage_dealt: number;
	blitz_duel_deaths: number;
	blitz_duel_health_regenerated: number;
	blitz_duel_losses: number;
	blitz_duel_melee_hits: number;
	blitz_duel_melee_swings: number;
	blitz_duel_rounds_played: number;
	blitz_duel_bow_hits: number;
	blitz_duel_bow_shots: number;
	best_winstreak_mode_blitz_duel: number;
	best_blitz_winstreak: number;
	blitz_duel_kills: number;
	blitz_duel_kit_wins: number;
	blitz_duel_reddragon_kit_wins: number;
	blitz_duel_wins: number;
	reddragon_kit_wins: number;
	duels_winstreak_best_blitz_duel: number;
	blitz_duel_golem_kit_wins: number;
	golem_kit_wins: number;
	astronaut_kit_wins: number;
	blitz_duel_astronaut_kit_wins: number;
	blitz_duel_slimeyslime_kit_wins: number;
	slimeyslime_kit_wins: number;
	blitz_duel_rogue_kit_wins: number;
	rogue_kit_wins: number;
	blitz_duel_pigman_kit_wins: number;
	pigman_kit_wins: number;
	best_winstreak_mode_op_duel: number;
	best_op_winstreak: number;
	op_duel_wins: number;
	duels_winstreak_best_bridge_duel: number;
	duels_winstreak_best_sumo_duel: number;
	op_duel_kills: number;
	duels_winstreak_best_uhc_duel: number;
	leaderboardPage_wins: number;
	blitz_duel_knight_kit_wins: number;
	knight_kit_wins: number;
	current_winstreak_mode_uhc_doubles: number;
	uhc_doubles_blocks_placed: number;
	uhc_doubles_bow_hits: number;
	uhc_doubles_bow_shots: number;
	uhc_doubles_damage_dealt: number;
	uhc_doubles_deaths: number;
	uhc_doubles_health_regenerated: number;
	uhc_doubles_kills: number;
	uhc_doubles_losses: number;
	uhc_doubles_melee_hits: number;
	uhc_doubles_melee_swings: number;
	uhc_doubles_rounds_played: number;
	current_winstreak_mode_op_doubles: number;
	op_doubles_damage_dealt: number;
	op_doubles_deaths: number;
	op_doubles_health_regenerated: number;
	op_doubles_kills: number;
	op_doubles_losses: number;
	op_doubles_melee_hits: number;
	op_doubles_melee_swings: number;
	op_doubles_rounds_played: number;
	leaderboardPage_goals: number;
	magician_kit_wins: number;
	sw_duel_magician_kit_wins: number;
	bowman_kit_wins: number;
	sw_duel_bowman_kit_wins: number;
	mw_duels_class: string;
}

export interface GingerBread {
	packages: string[];
	engine_active: string;
	booster_active: string;
	shoes_active: string;
	jacket_active: string;
	helmet_active: string;
	pants_active: string;
	skin_active: string;
	frame_active: string;
	coins: number;
	horn: string;
	banana_hits_received: number;
	banana_hits_sent: number;
	box_pickups: number;
	box_pickups_monthly_b: number;
	box_pickups_retro: number;
	box_pickups_weekly_b: number;
	coins_picked_up: number;
	laps_completed: number;
	retro_plays: number;
	box_pickups_olympus: number;
	olympus_plays: number;
	box_pickups_junglerush: number;
	junglerush_plays: number;
	parts: string;
	box_pickups_hypixelgp: number;
	hypixelgp_plays: number;
}

export interface HungerGames {
	coins: number;
	wins_teams_normal: number;
	wins_solo_normal: number;
	packages: string[];
	autoarmor: boolean;
	wins: number;
	wins_backup: number;
	chests_opened: number;
	chests_opened_knight: number;
	damage: number;
	damage_knight: number;
	damage_taken: number;
	damage_taken_knight: number;
	deaths: number;
	exp_knight: number;
	games_played: number;
	games_played_knight: number;
	kills: number;
	kills_knight: number;
	kills_solo_normal: number;
	time_played: number;
	time_played_knight: number;
	arrows_fired: number;
	arrows_fired_knight: number;
	potions_drunk: number;
	potions_drunk_knight: number;
}

export interface Legacy {
	gingerbread_tokens: number;
	tokens: number;
	total_tokens: number;
	next_tokens_seconds: number;
}

export interface Mcgo {
	coins: number;
	lastTourneyAd: number;
	pocket_change: number;
	kills_deathmatch: number;
	game_wins: number;
	grenade_kills: number;
	kills: number;
	bombs_defused: number;
	packages: string[];
	game_wins_deathmatch: number;
	headshot_kills: number;
	grenadeKills: number;
	bombs_planted: number;
}

export interface Paintball {
	packages: string[];
	coins: number;
}

export interface Pit {
	profile: Profile;
	pit_stats_ptl: { [key: string]: number };
}

export interface Profile {
	moved_achievements_1: boolean;
	outgoing_offers: any[];
	moved_achievements_2: boolean;
	items_last_buy: ItemsLastBuy;
	leaderboard_stats: LeaderboardStats;
	last_save: number;
	king_quest: KingQuest;
	inv_armor: InvArmor;
	login_messages: any[];
	hotbar_favorites: number[];
	spire_stash_inv: InvArmor;
	xp: number;
	inv_contents: InvArmor;
	cheap_milk: boolean;
	zero_point_three_gold_transfer: boolean;
	bounties: any[];
	spire_stash_armor: InvArmor;
	cash: number;
	cash_during_prestige_0: number;
}

export interface InvArmor {
	type: number;
	data: number[];
}

export interface ItemsLastBuy {
	obsidian: number;
}

export interface KingQuest {
	kills: number;
}

export interface LeaderboardStats {
	Pit_tdm_blue_kills_2021_spring: number;
}

export interface SkyBlock {
	profiles: Profiles;
}

export interface Profiles {
	ec828194fad349ee8c049832e3383e75: Ec828194Fad349Ee8C049832E3383E75;
}

export interface Ec828194Fad349Ee8C049832E3383E75 {
	profile_id: string;
	cute_name: string;
}

export interface SkyWars {
	levelFormatted: string;
	packages: string[];
	souls: number;
	activeKit_SOLO: string;
	activeKit_SOLO_random: boolean;
	games_played_skywars: number;
	skywars_experience: number;
	blocks_broken: number;
	blocks_placed: number;
	chests_opened: number;
	chests_opened_kit_basic_solo_default: number;
	chests_opened_solo: number;
	coins: number;
	deaths: number;
	deaths_kit_basic_solo_default: number;
	deaths_solo: number;
	deaths_solo_normal: number;
	games: number;
	games_kit_basic_solo_default: number;
	games_solo: number;
	kills: number;
	kills_kit_basic_solo_default: number;
	kills_monthly_b: number;
	kills_solo: number;
	kills_solo_normal: number;
	kills_weekly_b: number;
	lastMode: string;
	longest_bow_kill: number;
	longest_bow_kill_kit_basic_solo_default: number;
	longest_bow_kill_solo: number;
	losses: number;
	losses_kit_basic_solo_default: number;
	losses_solo: number;
	losses_solo_normal: number;
	melee_kills: number;
	melee_kills_kit_basic_solo_default: number;
	melee_kills_solo: number;
	most_kills_game: number;
	most_kills_game_kit_basic_solo_default: number;
	most_kills_game_solo: number;
	souls_gathered: number;
	survived_players: number;
	survived_players_kit_basic_solo_default: number;
	survived_players_solo: number;
	time_played: number;
	time_played_kit_basic_solo_default: number;
	time_played_solo: number;
	void_kills: number;
	void_kills_kit_basic_solo_default: number;
	void_kills_solo: number;
	win_streak: number;
	quits: number;
	egg_thrown: number;
	kills_monthly_a: number;
	kills_weekly_a: number;
	chests_opened_team: number;
	deaths_team: number;
	deaths_team_normal: number;
	losses_team: number;
	losses_team_normal: number;
	survived_players_team: number;
	time_played_team: number;
	arrows_hit: number;
	arrows_hit_kit_mining_team_default: number;
	arrows_hit_solo: number;
	arrows_shot: number;
	arrows_shot_kit_mining_team_default: number;
	arrows_shot_solo: number;
	chests_opened_kit_mining_team_default: number;
	deaths_kit_mining_team_default: number;
	deaths_solo_insane: number;
	games_kit_mining_team_default: number;
	kills_kit_mining_team_default: number;
	kills_solo_insane: number;
	longest_bow_kill_kit_mining_team_default: number;
	longest_bow_shot: number;
	longest_bow_shot_kit_mining_team_default: number;
	longest_bow_shot_solo: number;
	losses_kit_mining_team_default: number;
	losses_solo_insane: number;
	melee_kills_kit_mining_team_default: number;
	most_kills_game_kit_mining_team_default: number;
	survived_players_kit_mining_team_default: number;
	time_played_kit_mining_team_default: number;
	challenge_attempts: number;
	challenge_attempts_1: number;
	challenge_attempts_1_kit_basic_solo_default: number;
	challenge_attempts_1_solo: number;
	challenge_attempts_kit_basic_solo_default: number;
	challenge_attempts_rookie: number;
	challenge_attempts_rookie_kit_basic_solo_default: number;
	challenge_attempts_rookie_solo: number;
	challenge_attempts_solo: number;
	assists: number;
	assists_kit_mining_team_default: number;
	assists_solo: number;
	void_kills_kit_mining_team_default: number;
	assists_kit_basic_solo_default: number;
	assists_team: number;
	kills_team: number;
	kills_team_normal: number;
	void_kills_team: number;
	deaths_team_insane: number;
	losses_team_insane: number;
	activeKit_TEAMS_random: boolean;
	activeKit_TEAMS: string;
	fastest_win: number;
	fastest_win_kit_basic_solo_default: number;
	fastest_win_solo: number;
	killstreak: number;
	killstreak_kit_basic_solo_default: number;
	killstreak_solo: number;
	wins: number;
	wins_kit_basic_solo_default: number;
	wins_solo: number;
	wins_solo_normal: number;
	arrows_hit_kit_basic_solo_default: number;
	arrows_shot_kit_basic_solo_default: number;
	longest_bow_shot_kit_basic_solo_default: number;
	heads: number;
	heads_decent: number;
	heads_decent_kit_basic_solo_default: number;
	heads_decent_solo: number;
	heads_kit_basic_solo_default: number;
	heads_solo: number;
	assists_kit_advanced_solo_armorer: number;
	chests_opened_kit_advanced_solo_armorer: number;
	deaths_kit_advanced_solo_armorer: number;
	kills_kit_advanced_solo_armorer: number;
	longest_bow_kill_kit_advanced_solo_armorer: number;
	losses_kit_advanced_solo_armorer: number;
	melee_kills_kit_advanced_solo_armorer: number;
	most_kills_game_kit_advanced_solo_armorer: number;
	survived_players_kit_advanced_solo_armorer: number;
	time_played_kit_advanced_solo_armorer: number;
	head_collection: HeadCollection;
	void_kills_kit_advanced_solo_armorer: number;
	enderpearls_thrown: number;
	fastest_win_kit_advanced_solo_armorer: number;
	games_kit_advanced_solo_armorer: number;
	killstreak_kit_advanced_solo_armorer: number;
	wins_kit_advanced_solo_armorer: number;
	arrows_shot_kit_advanced_solo_armorer: number;
	arrows_hit_kit_advanced_solo_armorer: number;
	longest_bow_shot_kit_advanced_solo_armorer: number;
	fall_kills: number;
	fall_kills_kit_advanced_solo_armorer: number;
	fall_kills_solo: number;
	heads_eww: number;
	heads_eww_kit_advanced_solo_armorer: number;
	heads_eww_solo: number;
	heads_kit_advanced_solo_armorer: number;
	heads_meh: number;
	heads_meh_kit_advanced_solo_armorer: number;
	heads_meh_solo: number;
	heads_yucky: number;
	heads_yucky_kit_advanced_solo_armorer: number;
	heads_yucky_solo: number;
	arrows_hit_kit_advanced_solo_knight: number;
	arrows_shot_kit_advanced_solo_knight: number;
	bow_kills: number;
	bow_kills_kit_advanced_solo_knight: number;
	bow_kills_solo: number;
	chests_opened_kit_advanced_solo_knight: number;
	fastest_win_kit_advanced_solo_knight: number;
	games_kit_advanced_solo_knight: number;
	kills_kit_advanced_solo_knight: number;
	killstreak_kit_advanced_solo_knight: number;
	longest_bow_kill_kit_advanced_solo_knight: number;
	longest_bow_shot_kit_advanced_solo_knight: number;
	melee_kills_kit_advanced_solo_knight: number;
	most_kills_game_kit_advanced_solo_knight: number;
	survived_players_kit_advanced_solo_knight: number;
	time_played_kit_advanced_solo_knight: number;
	void_kills_kit_advanced_solo_knight: number;
	wins_kit_advanced_solo_knight: number;
	deaths_kit_advanced_solo_knight: number;
	losses_kit_advanced_solo_knight: number;
	assists_kit_advanced_solo_knight: number;
	usedSoulWell: boolean;
	soul_well: number;
	solo_mining_expertise: number;
	soul_well_rares: number;
	heads_decent_kit_advanced_solo_knight: number;
	heads_kit_advanced_solo_knight: number;
	heads_meh_kit_advanced_solo_knight: number;
	heads_salty: number;
	heads_salty_kit_advanced_solo_knight: number;
	heads_salty_solo: number;
	heads_tasty: number;
	heads_tasty_kit_advanced_solo_knight: number;
	heads_tasty_solo: number;
	team_nourishment: number;
	fall_kills_kit_advanced_solo_knight: number;
	solo_lucky_charm: number;
	toggle_solo_lucky_charm: boolean;
	heads_eww_kit_advanced_solo_knight: number;
	items_enchanted: number;
	solo_juggernaut: number;
	team_mining_expertise: number;
	chests_opened_kit_attacking_team_jester: number;
	deaths_kit_attacking_team_jester: number;
	losses_kit_attacking_team_jester: number;
	survived_players_kit_attacking_team_jester: number;
	time_played_kit_attacking_team_jester: number;
	chests_opened_kit_defending_team_armorer: number;
	deaths_kit_defending_team_armorer: number;
	kills_kit_defending_team_armorer: number;
	losses_kit_defending_team_armorer: number;
	most_kills_game_kit_defending_team_armorer: number;
	survived_players_kit_defending_team_armorer: number;
	time_played_kit_defending_team_armorer: number;
	void_kills_kit_defending_team_armorer: number;
	games_kit_defending_team_armorer: number;
	longest_bow_kill_kit_defending_team_armorer: number;
	melee_kills_kit_defending_team_armorer: number;
	arrows_hit_kit_defending_team_armorer: number;
	arrows_shot_kit_defending_team_armorer: number;
	longest_bow_shot_kit_defending_team_armorer: number;
	heads_divine: number;
	heads_divine_kit_defending_team_armorer: number;
	heads_divine_solo: number;
	heads_kit_defending_team_armorer: number;
	heads_meh_kit_defending_team_armorer: number;
	heads_succulent: number;
	heads_succulent_kit_defending_team_armorer: number;
	heads_succulent_solo: number;
	arrows_shot_kit_attacking_team_jester: number;
	kills_kit_attacking_team_jester: number;
	most_kills_game_kit_attacking_team_jester: number;
	void_kills_kit_attacking_team_jester: number;
	lastTourneyAd: number;
	heads_succulent_kit_advanced_solo_knight: number;
	heads_yucky_kit_advanced_solo_knight: number;
	refill_chest_destroy: number;
	heads_divine_kit_advanced_solo_knight: number;
	heads_heavenly: number;
	heads_heavenly_kit_advanced_solo_knight: number;
	heads_heavenly_solo: number;
	solo_resistance_boost: number;
	toggle_solo_resistance_boost: boolean;
	solo_ender_mastery: number;
	solo_nourishment: number;
	solo_bridger: number;
	extra_wheels: number;
	solo_blazing_arrows: number;
	soul_well_legendaries: number;
}

export interface HeadCollection {
	recent: Prestigious[];
	prestigious: Prestigious[];
}

export interface Prestigious {
	uuid: string;
	timestamp: number;
	mode: Mode;
	sacrifice: string;
}

export enum Mode {
	SoloNormal = "solo_normal",
}

export interface SuperSmash {
	coins: number;
	lastLevel_THE_BULK: number;
	active_class: string;
}

export interface TNTGames {
	new_witherwizard_explode: number;
	new_spleef_repulsor: number;
	new_firewizard_explode: number;
	new_spleef_double_jumps: number;
	new_icewizard_regen: number;
	new_bloodwizard_explode: number;
	new_firewizard_regen: number;
	packages: string[];
	new_tntag_speedy: number;
	new_pvprun_double_jumps: number;
	new_kineticwizard_regen: number;
	new_tntrun_double_jumps: number;
	new_bloodwizard_regen: number;
	new_icewizard_explode: number;
	wins: number;
	new_spleef_tripleshot: number;
	new_witherwizard_regen: number;
	new_kineticwizard_explode: number;
	run_potions_splashed_on_players: number;
	record_tntrun: number;
	coins: number;
	deaths_tntrun: number;
	winstreak: number;
	wins_tntrun: number;
	record_pvprun: number;
	deaths_pvprun: number;
	kills_pvprun: number;
	deaths_bowspleef: number;
	tags_bowspleef: number;
	kills_tntag: number;
	points_capture: number;
	kinetic_healing_capture: number;
	air_time_capture: number;
	new_tntrun_slowness_potions: number;
	new_tntrun_speed_potions: number;
	lastTourneyAd: number;
}

export interface Uhc {
	coins: number;
	clearup_achievement: boolean;
	saved_stats: boolean;
}

export interface VampireZ {
	updated_stats: boolean;
	coins: number;
}

export interface VanityMeta {
	packages: string[];
}
