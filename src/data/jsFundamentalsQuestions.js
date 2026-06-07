import { jsFundamentalsQuestionBank } from './jsFundamentalsQuestionBank.generated';

const MODULE_SOURCE_TO_BANK_ID = {
  'values-and-variables.json': 'values_variables',
  'data-types.json': 'data_types',
  'basic-operators.json': 'basic_operators',
  'if-else.json': 'if_else',
  'type-conversion.json': 'type_conversion_coercion',
  'truthy-falsy.json': 'truthy_falsy',
  'strict-mode.json': 'strict_mode',
  'functions.json': 'functions',
  'function-declarations.json': 'function_declarations_expressions',
  'arrays.json': 'arrays',
  'array-methods.json': 'array_operations',
  'objects.json': 'intro_objects',
  'dot-bracket.json': 'dot_bracket',
  'object-methods.json': 'object_methods',
  'for-loop.json': 'for_loop',
  'looping-arrays-breaking.json': 'looping_arrays_break_continue',
  'looping-backwards.json': 'looping_backwards_nested',
  'while-loop.json': 'while_loop',
};

export function getJsFundamentalsQuestions(source) {
  const bankId = MODULE_SOURCE_TO_BANK_ID[source];
  if (!bankId) return null;

  const questions = jsFundamentalsQuestionBank[bankId];
  if (!questions) return null;

  return {
    mcq: questions.mcq ?? [],
    complete_code_tests: questions.fill ?? [],
  };
}
