import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { db } from './index';
import { codeSnippets, analysisItems } from './schema';
import { languageEnum } from './schema/enums';
import { faker } from '@faker-js/faker';

const getScoreCategory = (score: number): 'terrible' | 'poor' | 'fair' | 'good' | 'excellent' => {
  if (score <= 3.0) return 'terrible';
  if (score <= 5.0) return 'poor';
  if (score <= 7.0) return 'fair';
  if (score <= 8.5) return 'good';
  return 'excellent';
};

const languages = ['javascript', 'typescript', 'python', 'java', 'csharp', 'php', 'html', 'css', 'sql', 'plaintext'] as const;

async function main() {
  console.log('Starting seed...');
  console.log('DATABASE_URL:', process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':***@')); // Hide password

  // Clear existing data
  try {
    await db.delete(analysisItems);
    await db.delete(codeSnippets);
    console.log('Cleared existing data');
  } catch (clearError) {
    console.warn('Warning: Could not clear existing data:', clearError);
    console.log('Continuing with insert...');
  }

  const snippetsToInsert = 100;
  const snippets = [];

  for (let i = 0; i < snippetsToInsert; i++) {
     const score = Number(faker.finance.amount({ min: 0, max: 10, dec: 1 }));
     const snippet = {
       code: faker.lorem.paragraphs(2, '\n'),
       language: faker.helpers.arrayElement(languages) as typeof languageEnum.enumValues[number],
       score: String(score),
       scoreCategory: getScoreCategory(score),
       roastMode: faker.datatype.boolean(),
       roastText: faker.lorem.sentences(3),
       createdAt: faker.date.past(),
     };
    snippets.push(snippet);
  }

  // Insert snippets and get their IDs
  const insertedSnippets = await db.insert(codeSnippets).values(snippets).returning({ id: codeSnippets.id });
  console.log(`Inserted ${insertedSnippets.length} snippets`);

  // For each snippet, create 1-5 analysis items
  const analysisToInsert = [];
  for (const snippet of insertedSnippets) {
    const itemCount = faker.number.int({ min: 1, max: 5 });
    for (let j = 0; j < itemCount; j++) {
      analysisToInsert.push({
        snippetId: snippet.id,
        severity: faker.helpers.arrayElement(['critical', 'warning', 'good']),
        title: faker.lorem.words(4),
        description: faker.lorem.sentences(2),
        createdAt: faker.date.recent(),
      });
    }
  }

  await db.insert(analysisItems).values(analysisToInsert);
  console.log(`Inserted ${analysisToInsert.length} analysis items`);

  console.log('Seed completed successfully!');
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});