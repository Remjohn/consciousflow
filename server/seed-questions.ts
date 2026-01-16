import 'dotenv/config';
import { db } from '../src/db';
import { coreTestQuestions } from '../src/db/schema';

/**
 * Seeds the 12 Core Test Questions from the Championship Framework
 * These are standardized indirect questions for evaluating candidates
 */
async function seedCoreQuestions() {
    console.log('🎯 Seeding 12 Core Test Questions...');

    const questions = [
        {
            questionId: 'Q1',
            questionFr: '« À partir de combien de partenaires une personne n\'est plus vraiment sérieuse selon toi ? »',
            questionEn: 'At what number of partners does someone stop being serious about relationships?',
            mappedMetric: 'valuesAlignment',
            scoringRules: JSON.stringify({
                '+5': 'Says 0-2 partners',
                '+2': 'Says 3-5 partners',
                '-5': 'Says 6+ partners OR relativizes ("ça dépend", "le passé c\'est le passé")'
            })
        },
        {
            questionId: 'Q2',
            questionFr: '« À quel âge idéal une femme devrait se marier selon toi ? »',
            questionEn: 'At what ideal age should a woman get married?',
            mappedMetric: 'valuesAlignment',
            scoringRules: JSON.stringify({
                '+5': '21-24 years old',
                '+2': '25-27 years old',
                '-5': '28+ or shows no urgency'
            })
        },
        {
            questionId: 'Q3',
            questionFr: '« Selon toi, comment deux personnes doivent apprendre à se connaître avant le mariage ? »',
            questionEn: 'How should two people get to know each other before marriage?',
            mappedMetric: 'disciplineStructure',
            scoringRules: JSON.stringify({
                '+5': 'Observation + family + church context',
                '0': 'Modern dating narrative',
                '-10': 'Physical/romantic-first approach (RED FLAG)'
            })
        },
        {
            questionId: 'Q4',
            questionFr: '« En cas de désaccord dans un couple, comment ça devrait se gérer selon toi ? »',
            questionEn: 'In case of disagreement in a couple, how should it be handled?',
            mappedMetric: 'communicationStyle',
            scoringRules: JSON.stringify({
                '+5': 'Dialogue + respect of male leadership',
                '0': '"Toujours égal sans structure"',
                '-5': 'Rejects leadership structure'
            })
        },
        {
            questionId: 'Q5',
            questionFr: '« Comment est ta relation avec ton père ? »',
            questionEn: 'How is your relationship with your father?',
            mappedMetric: 'familyStructure',
            scoringRules: JSON.stringify({
                '+5': 'Respectful / loving relationship',
                '0': 'Absent but respectful',
                '-10': 'Contempt / hostility (RED FLAG)'
            })
        },
        {
            questionId: 'Q6',
            questionFr: '« Quelle femme admires-tu le plus dans ta famille ? Pourquoi ? »',
            questionEn: 'Which woman do you admire most in your family? Why?',
            mappedMetric: 'valuesAlignment',
            scoringRules: JSON.stringify({
                '+5': 'Praises care, sacrifice, family orientation',
                '-2': 'Praises only independence',
                '0': 'No answer / confusion'
            })
        },
        {
            questionId: 'Q7',
            questionFr: '« Tu penses quoi des filles très actives sur les réseaux sociaux ? »',
            questionEn: 'What do you think about girls who are very active on social media?',
            mappedMetric: 'socialMediaConduct',
            scoringRules: JSON.stringify({
                '+5': 'Critical / reserved attitude',
                '0': 'Neutral',
                '-5': 'Defends validation-seeking behavior'
            })
        },
        {
            questionId: 'Q8',
            questionFr: '« Un homme et une femme peuvent être juste amis selon toi ? »',
            questionEn: 'Can a man and woman just be friends in your opinion?',
            mappedMetric: 'valuesAlignment',
            scoringRules: JSON.stringify({
                '+6': 'Clear "no" with strict boundaries (GREEN FLAG)',
                '0': 'Conditional response',
                '-5': '"Yes, it\'s normal"'
            })
        },
        {
            questionId: 'Q9',
            questionFr: '« Quand tu es énervée, tu fais quoi généralement ? »',
            questionEn: 'When you\'re upset, what do you generally do?',
            mappedMetric: 'communicationStyle',
            scoringRules: JSON.stringify({
                '+5': 'Withdraws, prays, reflects',
                '0': 'Emotional talking',
                '-5': 'Explodes, blames'
            })
        },
        {
            questionId: 'Q10',
            questionFr: '« Selon toi, le rôle principal d\'un homme dans une famille c\'est quoi ? »',
            questionEn: 'In your opinion, what is the main role of a man in a family?',
            mappedMetric: 'valuesAlignment',
            scoringRules: JSON.stringify({
                '+5': 'Protection + provision + leadership',
                '-2': 'Emotional support only',
                '-5': 'Rejects provider role'
            })
        },
        {
            questionId: 'Q11',
            questionFr: '« Qu\'est-ce qu\'une bonne épouse accepte même quand c\'est difficile ? »',
            questionEn: 'What does a good wife accept even when it\'s difficult?',
            mappedMetric: 'valuesAlignment',
            scoringRules: JSON.stringify({
                '+6': 'Patience, respect, service (GREEN FLAG)',
                '0': 'Compromise only',
                '-5': 'Self-first narrative'
            })
        },
        {
            questionId: 'Q12',
            questionFr: '« Comment tu imagines ta vie dans 10 ans ? »',
            questionEn: 'How do you imagine your life in 10 years?',
            mappedMetric: 'valuesAlignment',
            scoringRules: JSON.stringify({
                '+5': 'Family-centered vision',
                '-2': 'Career-only focus',
                '-5': 'No vision / confusion'
            })
        }
    ];

    // Upsert questions
    for (const q of questions) {
        try {
            await db.insert(coreTestQuestions).values(q);
            console.log(`  ✅ ${q.questionId}: ${q.questionFr.substring(0, 40)}...`);
        } catch (e) {
            console.log(`  ⏭️  ${q.questionId} already exists, skipping`);
        }
    }

    console.log('\n🎯 12 Core Test Questions seeded successfully!');
    process.exit(0);
}

seedCoreQuestions().catch(e => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
});
