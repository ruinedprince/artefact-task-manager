import { test } from 'node:test';
import assert from 'node:assert/strict';
import i18n from '../lib/i18n';
import { theory } from '../src/lib/theory';

test('all interface messages and theory sections are available in each language', () => {
  const keys = Object.keys(i18n.getResourceBundle('pt', 'translation'));
  for (const language of ['pt', 'en', 'es'] as const) {
    const messages = i18n.getResourceBundle(language, 'translation');
    assert.deepEqual(Object.keys(messages).sort(), [...keys].sort(), `${language} message keys`);
    for (const key of keys) assert.ok(messages[key]?.trim(), `${language}: ${key}`);
    assert.equal(theory[language].length, 6);
    assert.ok(theory[language].every(section => section.title.trim() && section.body.trim()));
  }
  assert.equal(i18n.getFixedT('en')('tasks'), 'Tasks');
  assert.equal(i18n.getFixedT('es')('tasks'), 'Tareas');
});
