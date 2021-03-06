"use strict";

var user = require('./nodebb').user,
	db = require('./nodebb').db,
	races = require('./races'),
	classes = require('./classes'),
	elements = require('./elements'),
	alignments = require('./alignments'),
	config = require('./config'),
	character = {};

character.create = function(uid, characterData, callback) {
	character.getCharacterField(uid, 'character_id', function(err, data) {
		if (data !== null) {
			return callback(true, {message: "[[of:character_twice]]"});
		}

		var raceData = races.data[characterData.character_race - 1],
			elementData = elements.data[characterData.character_element - 1],
			classData = classes.data[characterData.character_class - 1];

		var character_might = Math.floor(Math.random() * 10) + 10 + (parseInt(raceData.race_might_bonus, 10) - parseInt(raceData.race_might_penalty, 10)),
			character_dexterity = Math.floor(Math.random() * 10) + 10 + (parseInt(raceData.race_dexterity_bonus, 10) - parseInt(raceData.race_dexterity_penalty, 10)),
			character_constitution = Math.floor(Math.random() * 10) + 10 + (parseInt(raceData.race_constitution_bonus, 10) - parseInt(raceData.race_constitution_penalty, 10)),
			character_intelligence = Math.floor(Math.random() * 10) + 10 + (parseInt(raceData.race_intelligence_bonus, 10) - parseInt(raceData.race_intelligence_penalty, 10)),
			character_wisdom = Math.floor(Math.random() * 10) + 10 + (parseInt(raceData.race_wisdom_bonus, 10) - parseInt(raceData.race_wisdom_penalty, 10)),
			character_charisma = Math.floor(Math.random() * 10) + 10 + (parseInt(raceData.race_charisma_bonus, 10) - parseInt(raceData.race_charisma_penalty, 10)),
			character_magic_attack = Math.floor(Math.random() * 10) + 10 + (parseInt(raceData.race_magic_attack_bonus, 10) - parseInt(raceData.race_magic_attack_penalty, 10)),
			character_magic_resistance = Math.floor(Math.random() * 10) + 10 + (parseInt(raceData.race_magic_resistance_bonus, 10) - parseInt(raceData.race_magic_resistance_penalty, 10)),

			character_skill_mining = 1 + (parseInt(raceData.race_skill_mining_bonus, 10) + parseInt(elementData.element_skill_mining_bonus, 10)),
			character_skill_stone = 1 + (parseInt(raceData.race_skill_stone_bonus, 10) + parseInt(elementData.element_skill_stone_bonus, 10)),
			character_skill_forge = 1 + (parseInt(raceData.race_skill_forge_bonus, 10) + parseInt(elementData.element_skill_forge_bonus, 10)),
			character_skill_enchantment = 1 + (parseInt(raceData.race_skill_enchantment_bonus, 10) + parseInt(elementData.element_skill_enchantment_bonus, 10)),
			character_skill_trading = 1 + (parseInt(raceData.race_skill_trading_bonus, 10) + parseInt(elementData.element_skill_trading_bonus, 10)),
			character_skill_thief = 1 + (parseInt(raceData.race_skill_thief_bonus, 10) + parseInt(elementData.element_skill_thief_bonus, 10)),

			character_hp = classData.class_base_hp,
			character_hp_max = classData.class_base_hp,
			character_mp = classData.class_base_mp,
			character_mp_max = classData.class_base_mp,
			character_ac = classData.class_base_ac;

		db.setObject('of:character:' + uid, {
			character_id: uid,
			character_name: characterData.character_name,
			character_desc: characterData.character_desc,
			character_race: characterData.character_race,
			character_class: characterData.character_class,
			character_alignment: characterData.character_alignment,
			character_element: characterData.character_element,
			character_hp: character_hp,
			character_hp_max: character_hp_max,
			character_mp: character_mp,
			character_mp_max: character_mp_max,
			character_ac: character_ac,
			character_xp: 0,
			character_level: 1,
			character_might: character_might,
			character_dexterity: character_dexterity,
			character_constitution: character_constitution,
			character_intelligence: character_intelligence,
			character_wisdom: character_wisdom,
			character_charisma: character_charisma,
			character_birth: Date.now(),
			character_battle_limit: config.data.character_battle_limit,
			character_skill_limit: config.data.character_skill_limit,
			character_trading_limit: config.data.character_trading_limit,
			character_thief_limit: config.data.character_thief_limit,
			character_sp: 0,
			character_magic_attack: character_magic_attack,
			character_magic_resistance: character_magic_resistance,
			character_skill_mining: character_skill_mining,
			character_skill_stone: character_skill_stone,
			character_skill_forge: character_skill_forge,
			character_skill_enchantment: character_skill_enchantment,
			character_skill_trading: character_skill_trading,
			character_skill_thief: character_skill_thief,
			character_skill_mining_uses: 0,
			character_skill_stone_uses: 0,
			character_skill_forge_uses: 0,
			character_skill_enchantment_uses: 0,
			character_skill_trading_uses: 0,
			character_skill_thief_uses: 0,
			character_victories: 0,
			character_defeats: 0,
			character_flees: 0,
			character_double_ko: 0,
			character_victories_pvp: 0,
			character_defeats_pvp: 0,
			character_flees_pvp: 0,
			character_fp: 0
		}, callback);
	});
};

character.delete = function(uid, callback) {
	db.delete('of:character:' + uid, function(err) {
		callback({status: err === null, error: err});
	});
};

character.getPoints = function(uid, callback) {
	user.getUserField(uid, 'currency', function(err, cash) {
		callback(err, cash);
	});
};

character.incrementPoints = function(uid, amount, callback) {
	user.incrementUserFieldBy(uid, 'currency', amount, callback);
};

character.decrementPoints = function(uid, amount, callback) {
	character.getPoints(uid, function(err, points) {
		/* decided to handle this at a higher level
		if (err || points < amount) {
			return callback({"status": 0, "message": "Insufficient Points"});
		}*/

		user.decrementUserFieldBy(uid, 'currency', amount, callback);
	});
};

character.getCharacterField = function(uid, field, callback) {
	db.getObjectField('of:character:' + uid, field, callback);
};

character.getCharacterFields = function(uid, fields, callback) {
	db.getObjectFields('of:character:' + uid, fields, callback);
};

character.setCharacterField = function(uid, field, value, callback) {
	db.setObjectField('of:character:' + uid, field, value, callback);
};

character.setCharacterFields = function(uid, data, callback) {
	db.setObject('of:character:' + uid, data, callback);
};

character.deleteObjectField = function(uid, field, callback) {
	db.deleteObjectField('of:character:' + uid, field, callback);
};

character.incrementCharacterFieldBy = function(uid, field, value, callback) {
	db.incrObjectFieldBy('of:character:' + uid, field, value, callback);
};

character.decrementCharacterFieldBy = function(uid, field, value, callback) {
	db.incrObjectFieldBy('of:character:' + uid, field, -value, callback);
};

character.getCharacterData = function(uid, callback) {
	db.getObject('of:character:' + uid, function(err, data) {
		if(err) {
			return callback(err);
		}

		callback(err, data);
	});
};

character.view = function(uid, callback) {
	character.getCharacterData(uid, function(err, data) {
		if (data) {
			data.character = true;

			var classData = classes.data[data.character_class-1],
				alignmentData = alignments.data[data.character_alignment-1],
				elementData = elements.data[data.character_element-1],
				raceData = races.data[data.character_race-1];

			data.character_class = classData.class_name;
			data.class_img = classData.class_img;

			data.character_alignment = alignmentData.alignment_name;
			data.alignment_img = alignmentData.alignment_img;

			data.character_element = elementData.element_name;
			data.element_img = elementData.element_img;

			data.character_race = raceData.race_name;
			data.race_img = raceData.race_img;

			data.character_age = parseInt(config.data.character_age, 10) + Math.ceil((Date.now() - data.character_birth) / 7862400);

			// look into why it's 90 - CSS fail
			data.hp_percent_width = Math.floor(data.character_hp / data.character_hp_max * 90);
			data.hp_percent_empty = 90 - data.hp_percent_width;
			data.mp_percent_width = Math.floor(data.character_mp / data.character_mp_max * 90);
			data.mp_percent_empty = 90 - data.mp_percent_width;

			data.deletable = !data.battle_id ? true : false;

			//todo:
			data.owner = true;
			
			require('./nodebb').user.getUserField(uid, 'currency', function(err, currency) {
				data.character_points = currency || 0;
				callback(err, data);
			});
		} else {
			callback(err, {
				"character": false,
				"races": races.data,
				"classes": classes.data,
				"elements": elements.data,
				"alignments": alignments.data
			});
		}
	});
};

module.exports = character;