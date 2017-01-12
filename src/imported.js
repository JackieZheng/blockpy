/*
Blockly.Blocks['classics_get_all'] = {
  init: function() {
    this.setHelpUrl('http://www.example.com/');
    this.setColour(WEATHER_HUE);
    this.appendDummyInput()
        .appendField("classics.get all books");
    this.setInputsInline(false);
    this.setOutput(true, "Number");
    this.setTooltip('Returns all the books');
  }
};
Blockly.Python['classics_get_all'] = function(block) {
    Blockly.Python.definitions_['import_classics'] = 'import classics';
    var code = 'classics.get_all()';
    return [code, Blockly.Python.ORDER_ATOMIC];
};

PythonToBlocks.KNOWN_MODULES['classics'] = {
    "get_all": ["classics_get_all"]
};
*/


function newBlock(name) {
    var block = blockpy.components.editor.blockly.newBlock(name);
    block.initSvg();
    block.render();
}

var DAYS = [
    ["Monday", "MON"],
    ["Tuesday", "TUE"],
    ["Wednesday", "WED"],
    ["Thursday", "THU"],
    ["Friday", "FRI"],
    ["Saturday", "SAT"],
    ["Sunday", "SUN"]
  ]

var DAYS_MAP = {
        'mon': 'parking.Day("MON")',
        'tue': 'parking.Day("TUE")',
        'wed': 'parking.Day("WED")',
        'thu': 'parking.Day("THU")',
        'fri': 'parking.Day("FRI")',
        'sat': 'parking.Day("SAT")',
        'sun': 'parking.Day("SUN")',
        'tod': 'parking.today()'
    };


Blockly.Blocks['datetime_day'] = {
  /**
   * Block for datetime day.
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      "message0": "%1",
      "args0": [
        {
          "type": "field_dropdown",
          "name": "DAY",
          "options": [["Today", "TODAY"]].concat(DAYS)
        }
      ],
      "output": "DatetimeDay",
      "colour": DATA_HUE,
      "tooltip": "Returns a day of the week",
      "helpUrl": ""
    });
  }
};
Blockly.Python['datetime_day'] = function(block) {
    Blockly.Python.definitions_['import_parking'] = 'import parking';
    var operator = DAYS_MAP[block.getFieldValue('DAY').slice(0, 3).toLowerCase()];
    return [operator, Blockly.Python.ORDER_ATOMIC];
};

var HOURS = [["1", "1"], ["2", "2"], ["3", "3"],
             ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"],
             ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"],
             ["12", "12"]];
var MINUTES = [["00", "00"], ["30", "30"]];
var MERIDIANS = [["am", "AM"], ["pm", "PM"]];

Blockly.Blocks['datetime_time'] = {
  /**
   * Block for datetime day.
   * @this Blockly.Block
   */
    init: function() {
        this.setColour(DATA_HUE);
        var dropdown = new Blockly.FieldDropdown([["Now", "NOW"]].concat(HOURS), function(opt) {
            var isNow = (opt == 'NOW');
            this.sourceBlock_.updateShape_(isNow);
        });
        this.appendDummyInput()
            .appendField(dropdown, 'HOUR');
        this.setInputsInline(true);
        this.setOutput(true, 'DatetimeTime');
        this.setTooltip("Returns a time of day");
    },
    mutationToDom: function() {
        var container = document.createElement('mutation');
        var isNow = (this.getFieldValue('HOUR') == 'NOW');
        container.setAttribute('isnow', isNow);
        return container;
    },
    domToMutation: function(xmlElement) {
        var isNow = (xmlElement.getAttribute('isnow') == 'true');
        this.updateShape_(isNow);
    },
    updateShape_: function(isNow) {
        // Add or remove a Value Input.
        var inputExists = this.getInput('EXTENDED');
        if (!isNow) {
            if (!inputExists) {
                var minuteMenu = new Blockly.FieldDropdown(MINUTES);
                var meridianMenu = new Blockly.FieldDropdown(MERIDIANS);
                this.appendDummyInput('EXTENDED')
                    .appendField(':')
                    .appendField(minuteMenu, 'MINUTE')
                    .appendField(meridianMenu, 'MERIDIAN');
            }
        } else if (inputExists) {
            this.removeInput('EXTENDED');
        }
    }
};

var HOURS_MAP = {
    '1': 'parking.one()',
    '2': 'parking.two()',
    '3': 'parking.three()',
    '4': 'parking.four()',
    '5': 'parking.five()',
    '6': 'parking.six()',
    '7': 'parking.seven()',
    '8': 'parking.eight()',
    '9': 'parking.nine()',
    '10': 'parking.ten()',
    '11': 'parking.eleven()',
    '12': 'parking.twelve()',
    'NOW': 'parking.now()'
};
var MINUTES_MAP = {
    '00': 'parking.exactly()',
    '30': 'parking.half()'
}
var MERIDIANS_MAP = {
    'AM': 'parking.am()',
    'PM': 'parking.pm()'
}

Blockly.Python['datetime_time'] = function(block) {
    Blockly.Python.definitions_['import_parking'] = 'import parking';
    var hour = block.getFieldValue('HOUR');
    var code;
    if (hour == "NOW") {
        code = "parking.now()";
    } else {
        var minute = parseInt(block.getFieldValue('MINUTE'));
        var meridian = Blockly.Python.quote_(block.getFieldValue('MERIDIAN'));
        code = 'parking.Time('+hour+','+minute+','+meridian+')';
    }
    return [code, Blockly.Python.ORDER_ATOMIC];
};

var convertDate = function(date) {
    date = date.slice(0, 3).toLowerCase();
    switch (date) {
        case "mon": return "Monday";
        case "tue": return "Tuesday";
        case "wed": return "Wednesday";
        case "thu": return "Thursday";
        case "fri": return "Friday";
        case "sat": return "Saturday";
        case "sun": return "Sunday";
        default: return date;
    }
}
var convertMinute = function(minute) {
    if (minute < 10) {
        return "0"+minute;
    } else {
        return ""+minute;
    }
}

PythonToBlocks.KNOWN_MODULES['parking'] = {
    "today": ["datetime_day", ["DAY", "TODAY"]],
    "day_compare": ["datetime_check_day", "OP", 
                            {"type": "variable", "mode": "value", "name": "LEFT"}, 
                            {"type": "mapper", "name": "VALUE", "method": convertDate}],
    "Day": ["datetime_day", {"type": "mapper", "name": "DAY", "method": convertDate}],
    "now": ["datetime_time", ["HOUR", "NOW"]],
    "Time": ["datetime_time", {"type": "integer", "name": "HOUR", "add_mutation": {"name": "@isnow", "value": "true"}}, 
                             {"type": "integer_mapper", "name": "MINUTE", "method": convertMinute}, 
                             "MERIDIAN"],
    "time_compare": ["datetime_check_time", "OP",
                            {"type": "variable", "mode": "value", "name": "LEFT"}, 
                            {"type": "integer", "name": "HOURS"},
                            {"type": "integer_mapper", "name": "MINUTES", "method": convertMinute},
                            "MERIDIANS"]
};

var equalityOperators = [
    ["==", "IS"],
    ["<", "BEFORE"],
    [">", "AFTER"],
    ["<=", "BEFORE_EQUAL"],
    ["=>", "AFTER_EQUAL"],
    ["!=", "IS_NOT"]
];
var equalityOperatorsConversions = {
    "IS": "parking.equal",
    "BEFORE": "parking.before",
    "AFTER": "parking.after",
    "BEFORE_EQUAL": "parking.before_equal",
    "AFTER_EQUAL": "parking.after_equal",
    "IS_NOT": "parking.not_equal",
}
// FINISH _time and _day
// Add in numbers and days to KNOWN_MODULES

Blockly.Blocks['datetime_check_day'] = {
  /**
   * Block for testing if something contains something.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(Blockly.Blocks.logic.HUE);
    this.setOutput(true, 'Boolean');
    this.appendValueInput('LEFT')
        .setCheck('DatetimeDay')
        .appendField(new Blockly.FieldDropdown(DAYS), 'VALUE')
        .appendField(new Blockly.FieldDropdown(equalityOperators), 'OP');
    
    this.setInputsInline(false);
  }
};

Blockly.Python['datetime_check_day'] = function(block) {
    Blockly.Python.definitions_['import_parking'] = 'import parking';
    var value = Blockly.Python.quote_(block.getFieldValue('VALUE'));
    var operator = Blockly.Python.quote_(block.getFieldValue('OP'));
    var left = Blockly.Python.valueToCode(block, 'LEFT', Blockly.Python.ORDER_ATOMIC) || "___";
    var code = "parking.day_compare(" + operator + ", " + left + ', ' + value + ")";
    return [code, Blockly.Python.ORDER_ATOMIC];
};


Blockly.Blocks['datetime_check_time'] = {
  /**
   * Block for testing if something contains something.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(Blockly.Blocks.logic.HUE);
    this.setOutput(true, 'Boolean');
    this.appendValueInput('LEFT')
        .setCheck('DatetimeTime')
        .appendField(new Blockly.FieldDropdown(HOURS), 'HOURS')
        .appendField(':')
        .appendField(new Blockly.FieldDropdown(MINUTES), 'MINUTES')
        .appendField(new Blockly.FieldDropdown(MERIDIANS), 'MERIDIANS')
        .appendField(new Blockly.FieldDropdown(equalityOperators), 'OP');
    //this.setInputsInline(true);
  }
};

Blockly.Python['datetime_check_time'] = function(block) {
    Blockly.Python.definitions_['import_parking'] = 'import parking';
    var hour = parseInt(block.getFieldValue('HOURS'));
    var minute = parseInt(block.getFieldValue('MINUTES'));
    var meridian = Blockly.Python.quote_(block.getFieldValue('MERIDIANS'));
    var operator = Blockly.Python.quote_(block.getFieldValue('OP'));
    var left = Blockly.Python.valueToCode(block, 'LEFT', Blockly.Python.ORDER_ATOMIC)
    var code = "parking.time_compare(" + operator+", "+left + ',' + hour + ',' + minute + ',' +meridian + ")";
    return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Blocks['controls_forEach'] = {
  /**
   * Block for 'for each' loop.
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      "message0": "for each item %1 in list %2 : ", //Blockly.Msg.CONTROLS_FOREACH_TITLE,
      "args0": [
        {
          "type": "input_value",
          "name": "VAR",
          "check": "Tuple"
        },
        {
          "type": "input_value",
          "name": "LIST",
          "check": "Array"
        }
      ],
      "inputsInline": true,
      "previousStatement": null,
      "nextStatement": null,
      "colour": Blockly.Blocks.loops.HUE,
      "helpUrl": Blockly.Msg.CONTROLS_FOREACH_HELPURL
    });
    this.appendStatementInput('DO')
        .appendField(Blockly.Msg.CONTROLS_FOREACH_INPUT_DO);
    this.setInputsInline(true);
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
    this.setTooltip(function() {
      return Blockly.Msg.CONTROLS_FOREACH_TOOLTIP.replace('%1',
          Blockly.Python.valueToCode(thisBlock, 'VAR', Blockly.Python.ORDER_RELATIONAL) || '___');
    });
  },
  customContextMenu: Blockly.Blocks['controls_for'].customContextMenu
};

Blockly.Python['controls_forEach'] = function(block) {
  // For each loop.
  var variable0 = Blockly.Python.valueToCode(block, 'VAR',
      Blockly.Python.ORDER_RELATIONAL) || '___';
  var argument0 = Blockly.Python.valueToCode(block, 'LIST',
      Blockly.Python.ORDER_RELATIONAL) || '___';
  var branch = Blockly.Python.statementToCode(block, 'DO');
  branch = Blockly.Python.addLoopTrap(branch, block.id) ||
      Blockly.Python.PASS;
  var code = 'for ' + variable0 + ' in ' + argument0 + ':\n' + branch;
  return code;
};

Blockly.Blocks['class_creation'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Create class")
        .appendField(new Blockly.FieldVariable("new class"), "CLASS");
    /*
    this.appendDummyInput()
        .appendField("Inherits from")
        .appendField(new Blockly.FieldVariable("j"), "NAME")
        .appendField(",")
        .appendField(new Blockly.FieldVariable("k"), "NAME");
    */
    this.appendStatementInput("BODY")
        .setCheck(null);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};
Blockly.Python['class_creation'] = function(block) {
  var class_name = Blockly.Python.variableDB_.getName(block.getFieldValue('CLASS'), Blockly.Variables.NAME_TYPE) || '___';
  var body = Blockly.Python.statementToCode(block, 'BODY') ||
      Blockly.Python.PASS;
  // TODO: Assemble Python into code variable.
  var code = 'class ' + class_name + ':\n' + body;
  return code;
};

Blockly.Blocks['list_comprehension'] = {
  init: function() {
    this.appendValueInput("body")
        .setCheck(null)
        .appendField("[");
    this.appendValueInput("var")
        .setCheck(null)
        .appendField("for");
    this.appendValueInput("list")
        .setCheck(null)
        .appendField("in");
    this.appendDummyInput()
        .appendField("]");
    this.setInputsInline(true);
    this.setOutput(true, null);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};
Blockly.Python['list_comprehension'] = function(block) {
  var value_body = Blockly.Python.valueToCode(block, 'body', Blockly.Python.ORDER_ATOMIC) || '___';
  var value_var = Blockly.Python.valueToCode(block, 'var', Blockly.Python.ORDER_ATOMIC) || '___';
  var value_list = Blockly.Python.valueToCode(block, 'list', Blockly.Python.ORDER_ATOMIC) || '___';
  // TODO: Assemble Python into code variable.
  var code = '['+value_body+' for '+value_var+' in '+value_list+']';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.Python.ORDER_NONE];
};