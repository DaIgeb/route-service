import * as Ajv from 'ajv';

const schema = {
  "properties": {
    "name": { "type": "string", "minLength": 3 },
    "elevation": { "type": "integer", "minimum": 0 },
    "distance": { "type": "integer", "minimum": 0 }
  },
  "required": ["name", "elevation", "distance"],
  "additionalProperties": false
};

const ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}
var validator = ajv.compile(schema);

export const validate = (obj: any): obj is TRoute => {
  var valid = validator(obj);
  if (!valid) {
    console.log(validator.errors);

    return false;
  }


  return true;
}
