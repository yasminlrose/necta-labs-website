export interface IngredientStudy {
  title: string;
  year: string;
  journal: string;
  finding: string;
  sampleSize?: string;
  url: string;
}

export interface IngredientData {
  slug: string;
  name: string;
  benefit: string;
  whatIsIt: string[];
  studies: IngredientStudy[];
  dose: string;
  doseRationale: string;
  foundIn: { product: string; slug: string }[];
  synergies: { name: string; slug: string; reason: string }[];
}

export const ingredients: Record<string, IngredientData> = {
  "lions-mane": {
    slug: "lions-mane",
    name: "Lion's Mane",
    benefit: "Supports brain health, memory, and focus by promoting nerve growth factor",
    whatIsIt: [
      "Lion's Mane (Hericium erinaceus) is a striking white mushroom that resembles a cascading waterfall of icicles. It's been used in traditional Chinese and Japanese medicine for centuries, prized for its ability to support cognitive function and nervous system health.",
      "Unlike most medicinal mushrooms, Lion's Mane has a unique ability to stimulate the production of Nerve Growth Factor (NGF) — a protein essential for the growth, maintenance, and survival of neurons. This makes it one of the most promising natural nootropics available.",
      "Modern research has confirmed what traditional practitioners knew intuitively: Lion's Mane genuinely supports memory, focus, and mental clarity. It's now one of the most studied functional mushrooms in the world."
    ],
    studies: [
      { title: "Improving effects of the mushroom Yamabushitake on mild cognitive impairment", year: "2009", journal: "Phytotherapy Research", finding: "Participants taking Lion's Mane showed significantly improved cognitive function scores compared to placebo over 16 weeks.", sampleSize: "30 adults aged 50-80", url: "https://pubmed.ncbi.nlm.nih.gov/18844328/" },
      { title: "Reduction of depression and anxiety by Hericium erinaceus intake", year: "2010", journal: "Biomedical Research", finding: "Four weeks of Lion's Mane supplementation reduced depression and anxiety scores in menopausal women.", sampleSize: "30 women", url: "https://pubmed.ncbi.nlm.nih.gov/20834180/" },
      { title: "Neurotrophic properties of the Lion's Mane mushroom", year: "2013", journal: "Journal of Agricultural and Food Chemistry", finding: "Lion's Mane extract stimulated NGF synthesis in nerve cells, supporting neuron growth and differentiation.", url: "https://pubmed.ncbi.nlm.nih.gov/24266378/" },
    ],
    dose: "2,000mg",
    doseRationale: "Our 2,000mg dose matches or exceeds the amounts used in the key clinical trials showing cognitive benefits. Most studies showing positive results used between 1,000–3,000mg daily of fruiting body extract.",
    foundIn: [{ product: "FOCUS", slug: "focus" }],
    synergies: [
      { name: "L-Theanine", slug: "l-theanine", reason: "L-Theanine promotes calm alertness that complements Lion's Mane's cognitive enhancement" },
      { name: "Bacopa Monnieri", slug: "bacopa-monnieri", reason: "Bacopa supports memory consolidation while Lion's Mane promotes nerve growth" },
      { name: "Ginkgo Biloba", slug: "ginkgo-biloba", reason: "Ginkgo improves cerebral blood flow, enhancing delivery of Lion's Mane's active compounds" },
    ],
  },
  "l-theanine": {
    slug: "l-theanine",
    name: "L-Theanine",
    benefit: "Promotes calm, focused alertness without drowsiness",
    whatIsIt: [
      "L-Theanine is an amino acid found naturally in green tea leaves. It's the reason a cup of matcha gives you calm focus rather than jittery energy — even though it contains caffeine.",
      "It works by increasing alpha brain waves, the same pattern associated with meditation and creative flow states. It also modulates neurotransmitters like GABA, serotonin, and dopamine, promoting relaxation without sedation.",
      "Unlike many calming compounds, L-Theanine doesn't make you drowsy. It's been shown to take the edge off caffeine while preserving — even enhancing — its focus-boosting effects."
    ],
    studies: [
      { title: "L-Theanine and caffeine in combination affect human cognition", year: "2008", journal: "Nutritional Neuroscience", finding: "The combination of L-Theanine and caffeine improved attention, task switching, and accuracy on cognitively demanding tasks.", sampleSize: "27 adults", url: "https://pubmed.ncbi.nlm.nih.gov/17182482/" },
      { title: "The effects of L-Theanine on alpha activity and stress", year: "2007", journal: "Asia Pacific Journal of Clinical Nutrition", finding: "L-Theanine significantly increased alpha brain wave activity within 40 minutes, indicating relaxed alertness.", sampleSize: "35 adults", url: "https://pubmed.ncbi.nlm.nih.gov/17182482/" },
    ],
    dose: "80mg",
    doseRationale: "80mg is the dose most commonly used in clinical studies demonstrating cognitive and calming effects. This is equivalent to roughly 4 cups of green tea in a single serving.",
    foundIn: [{ product: "FOCUS", slug: "focus" }],
    synergies: [
      { name: "Lion's Mane", slug: "lions-mane", reason: "Lion's Mane promotes nerve growth while L-Theanine optimises neurotransmitter balance" },
      { name: "Rhodiola Rosea", slug: "rhodiola-rosea", reason: "Rhodiola combats mental fatigue, pairing well with L-Theanine's calm focus" },
    ],
  },
  "rhodiola-rosea": {
    slug: "rhodiola-rosea",
    name: "Rhodiola Rosea",
    benefit: "Reduces mental fatigue and improves endurance under stress",
    whatIsIt: [
      "Rhodiola Rosea is an adaptogenic herb that grows in cold, mountainous regions of Europe and Asia. Vikings used it to enhance physical strength and endurance, and it's been a cornerstone of Scandinavian and Russian traditional medicine for centuries.",
      "As a true adaptogen, Rhodiola helps your body respond more effectively to stress — whether physical, mental, or emotional. It works by modulating cortisol levels and supporting the stress-response pathways in your brain.",
      "It's particularly valued for its anti-fatigue effects. Research shows it can improve mental performance during periods of stress and sleep deprivation, making it ideal for demanding workdays."
    ],
    studies: [
      { title: "A randomized trial of Rhodiola rosea on mental fatigue", year: "2003", journal: "Phytomedicine", finding: "Single doses of Rhodiola significantly reduced mental fatigue and improved cognitive function during night shifts.", sampleSize: "56 physicians", url: "https://pubmed.ncbi.nlm.nih.gov/12725561/" },
      { title: "Rhodiola rosea in stress-induced fatigue", year: "2012", journal: "Phytomedicine", finding: "Rhodiola supplementation improved stress symptoms, fatigue, and quality of life over 4 weeks.", sampleSize: "101 adults", url: "https://pubmed.ncbi.nlm.nih.gov/22348650/" },
    ],
    dose: "200mg",
    doseRationale: "200mg of standardised Rhodiola extract (3% rosavins, 1% salidroside) matches the effective dose range used in clinical trials demonstrating anti-fatigue and cognitive benefits.",
    foundIn: [{ product: "FOCUS", slug: "focus" }],
    synergies: [
      { name: "L-Theanine", slug: "l-theanine", reason: "L-Theanine provides calm focus while Rhodiola builds stress resilience" },
      { name: "Ginkgo Biloba", slug: "ginkgo-biloba", reason: "Ginkgo supports brain circulation while Rhodiola fights mental fatigue" },
    ],
  },
  "ginkgo-biloba": {
    slug: "ginkgo-biloba",
    name: "Ginkgo Biloba",
    benefit: "Enhances circulation to the brain for memory and cognitive clarity",
    whatIsIt: [
      "Ginkgo Biloba is one of the oldest living tree species on Earth — individual trees can live over 1,000 years. Its leaves have been used in traditional Chinese medicine for millennia to support memory and mental sharpness.",
      "It works primarily by improving blood flow to the brain, increasing oxygen and nutrient delivery to neurons. It also has powerful antioxidant properties that protect brain cells from oxidative damage.",
      "Modern research has validated its traditional use, showing benefits for working memory, processing speed, and attention — particularly in adults under cognitive demand."
    ],
    studies: [
      { title: "Ginkgo biloba extract improves cognition in healthy adults", year: "2000", journal: "Psychopharmacology", finding: "Ginkgo extract significantly improved speed of attention, memory, and accuracy on cognitive tasks.", sampleSize: "20 healthy adults", url: "https://pubmed.ncbi.nlm.nih.gov/11128006/" },
      { title: "Effects of Ginkgo biloba on cerebral blood flow", year: "2011", journal: "Human Psychopharmacology", finding: "Ginkgo increased cerebral blood flow within one hour of ingestion.", url: "https://pubmed.ncbi.nlm.nih.gov/21858874/" },
    ],
    dose: "140mg",
    doseRationale: "140mg of standardised Ginkgo extract (24% flavone glycosides, 6% terpene lactones) is within the effective clinical range of 120–240mg daily used in cognitive trials.",
    foundIn: [{ product: "FOCUS", slug: "focus" }],
    synergies: [
      { name: "Lion's Mane", slug: "lions-mane", reason: "Enhanced brain blood flow helps deliver Lion's Mane's nerve growth compounds more effectively" },
      { name: "Bacopa Monnieri", slug: "bacopa-monnieri", reason: "Both support memory through complementary mechanisms" },
    ],
  },
  "bacopa-monnieri": {
    slug: "bacopa-monnieri",
    name: "Bacopa Monnieri",
    benefit: "Enhances memory, learning, and information processing speed",
    whatIsIt: [
      "Bacopa Monnieri (also known as Brahmi) is a creeping herb native to wetlands across the world. It's been used in Ayurvedic medicine for over 3,000 years as a brain tonic to enhance memory and learning.",
      "It contains active compounds called bacosides, which support the growth of nerve endings (dendrites) and protect neurons from oxidative stress. This dual action makes it one of the most evidence-backed memory-enhancing botanicals.",
      "Unlike stimulants, Bacopa works gradually — most studies show benefits building over 4–12 weeks of consistent use, making it ideal for daily supplementation."
    ],
    studies: [
      { title: "The chronic effects of Brahmi on human memory", year: "2001", journal: "Psychopharmacology", finding: "12 weeks of Bacopa supplementation significantly improved speed of information processing and memory consolidation.", sampleSize: "46 healthy adults", url: "https://pubmed.ncbi.nlm.nih.gov/11498727/" },
      { title: "Effects of Bacopa monnieri on cognitive function", year: "2014", journal: "Journal of Ethnopharmacology", finding: "Meta-analysis confirmed Bacopa improves attention, cognitive processing, and working memory.", url: "https://pubmed.ncbi.nlm.nih.gov/24252493/" },
    ],
    dose: "300mg",
    doseRationale: "300mg of Bacopa extract (standardised to 55% bacosides) matches the most common effective dose used across clinical trials. This is the gold-standard amount for memory benefits.",
    foundIn: [{ product: "FOCUS", slug: "focus" }],
    synergies: [
      { name: "Lion's Mane", slug: "lions-mane", reason: "Lion's Mane promotes nerve growth while Bacopa strengthens nerve connections" },
      { name: "Ginkgo Biloba", slug: "ginkgo-biloba", reason: "Improved cerebral blood flow enhances Bacopa's memory-boosting effects" },
    ],
  },
  "reishi": {
    slug: "reishi",
    name: "Reishi",
    benefit: "Modulates immune response and supports deep resilience",
    whatIsIt: [
      "Reishi (Ganoderma lucidum) is known as the 'Mushroom of Immortality' in traditional Chinese medicine. It's been revered for over 2,000 years as a tonic for longevity, vitality, and immune strength.",
      "It contains over 400 bioactive compounds, including beta-glucans and triterpenoids, which modulate the immune system — helping it respond appropriately rather than overreacting or underperforming.",
      "Reishi is also valued for its calming properties. Unlike stimulating immune supplements, it supports your body's natural defences while promoting a sense of calm and balance."
    ],
    studies: [
      { title: "Ganoderma lucidum (Reishi) immunomodulation", year: "2016", journal: "Cochrane Database of Systematic Reviews", finding: "Reishi showed significant immunomodulatory effects and improved quality of life markers in patients.", url: "https://pubmed.ncbi.nlm.nih.gov/27045603/" },
      { title: "Immunomodulating effect of Ganoderma in advanced-stage cancer", year: "2003", journal: "International Immunopharmacology", finding: "Reishi polysaccharides enhanced immune cell counts and activity in cancer patients.", sampleSize: "34 patients", url: "https://pubmed.ncbi.nlm.nih.gov/14555305/" },
    ],
    dose: "1,500mg",
    doseRationale: "Our 1,500mg dose of dual-extracted Reishi (fruiting body) provides a clinically meaningful amount of beta-glucans and triterpenoids, aligned with doses used in immune-modulation research.",
    foundIn: [{ product: "IMMUNITY", slug: "immunity" }],
    synergies: [
      { name: "Elderberry", slug: "elderberry", reason: "Elderberry provides direct antioxidant defence while Reishi modulates immune intelligence" },
      { name: "Ashwagandha", slug: "ashwagandha", reason: "Both are adaptogens that support stress resilience and immune balance" },
    ],
  },
  "elderberry": {
    slug: "elderberry",
    name: "Elderberry",
    benefit: "Rich in antioxidants, supports immune defences",
    whatIsIt: [
      "Elderberry (Sambucus nigra) has been used as a natural remedy for centuries across Europe. The deep purple berries are packed with anthocyanins — powerful antioxidants that give them their distinctive colour and immune-supporting properties.",
      "Modern research has shown elderberry can reduce the duration and severity of colds and flu by stimulating the immune system's cytokine response. It's one of the most popular and well-studied natural immune supplements.",
    ],
    studies: [
      { title: "Elderberry supplementation reduces cold duration and symptoms in air travellers", year: "2016", journal: "Nutrients", finding: "Elderberry reduced cold duration by an average of 2 days in overseas travellers.", sampleSize: "312 travellers", url: "https://pubmed.ncbi.nlm.nih.gov/27023596/" },
      { title: "Randomized study of elderberry on influenza", year: "2004", journal: "Journal of International Medical Research", finding: "Elderberry extract shortened flu symptoms by an average of 4 days compared to placebo.", sampleSize: "60 patients", url: "https://pubmed.ncbi.nlm.nih.gov/15080016/" },
    ],
    dose: "500mg",
    doseRationale: "500mg of standardised elderberry extract provides a concentrated dose of anthocyanins consistent with studies showing immune-boosting and antiviral benefits.",
    foundIn: [{ product: "IMMUNITY", slug: "immunity" }],
    synergies: [
      { name: "Reishi", slug: "reishi", reason: "Reishi modulates immune intelligence while Elderberry provides direct antioxidant defence" },
      { name: "Vitamin C", slug: "vitamin-c", reason: "Both support immune cell function through complementary antioxidant pathways" },
    ],
  },
  "ashwagandha": {
    slug: "ashwagandha",
    name: "Ashwagandha",
    benefit: "Reduces cortisol and supports stress resilience",
    whatIsIt: [
      "Ashwagandha (Withania somnifera) is one of the most important herbs in Ayurvedic medicine, used for over 3,000 years as a rejuvenating tonic. Its name translates to 'smell of the horse,' referring to both its distinctive scent and its traditional association with strength and vitality.",
      "It's classified as an adaptogen, meaning it helps your body adapt to and resist physical and mental stress. It works primarily by regulating cortisol — the body's primary stress hormone.",
      "Research shows it can significantly reduce stress and anxiety, improve sleep quality, and even support immune function — making it a cornerstone of any resilience-focused supplement."
    ],
    studies: [
      { title: "A prospective, randomized study of Ashwagandha root extract", year: "2012", journal: "Indian Journal of Psychological Medicine", finding: "Ashwagandha reduced serum cortisol levels by 28% and significantly improved resistance towards stress.", sampleSize: "64 adults", url: "https://pubmed.ncbi.nlm.nih.gov/23439798/" },
      { title: "Efficacy and safety of Ashwagandha on stress and anxiety", year: "2019", journal: "Medicine", finding: "Systematic review confirmed Ashwagandha significantly reduces stress and anxiety across multiple trials.", url: "https://pubmed.ncbi.nlm.nih.gov/31517876/" },
    ],
    dose: "300mg",
    doseRationale: "300mg of KSM-66 Ashwagandha root extract is the most widely studied dose, consistently showing stress and cortisol reduction benefits in clinical trials.",
    foundIn: [{ product: "IMMUNITY", slug: "immunity" }],
    synergies: [
      { name: "Reishi", slug: "reishi", reason: "Both adaptogens work together to build deep stress resilience and immune balance" },
      { name: "Chamomile", slug: "chamomile", reason: "Chamomile provides immediate calm while Ashwagandha builds long-term stress resilience" },
    ],
  },
  "vitamin-c": {
    slug: "vitamin-c",
    name: "Vitamin C",
    benefit: "Essential for immune defence and collagen synthesis",
    whatIsIt: [
      "Vitamin C (ascorbic acid) is perhaps the most well-known immune nutrient. It's essential for the growth, development, and repair of all body tissues, and plays a critical role in immune cell function.",
      "Your body can't produce or store Vitamin C, so daily intake is essential. It's a powerful antioxidant that protects cells from free radical damage and supports the production of white blood cells that fight infections.",
    ],
    studies: [
      { title: "Vitamin C and immune function", year: "2017", journal: "Nutrients", finding: "Vitamin C supports both innate and adaptive immune systems, with deficiency impairing immunity and increasing susceptibility to infections.", url: "https://pubmed.ncbi.nlm.nih.gov/29099763/" },
    ],
    dose: "200mg",
    doseRationale: "200mg provides optimal tissue saturation levels according to pharmacokinetic research — additional amounts beyond this are largely excreted.",
    foundIn: [{ product: "IMMUNITY", slug: "immunity" }, { product: "GLOW", slug: "glow" }],
    synergies: [
      { name: "Elderberry", slug: "elderberry", reason: "Both provide antioxidant defence through complementary pathways" },
      { name: "Marine Collagen", slug: "marine-collagen", reason: "Vitamin C is essential for collagen synthesis — they work together for skin health" },
    ],
  },
  "zinc": {
    slug: "zinc",
    name: "Zinc",
    benefit: "Essential mineral for immune defence and cell division",
    whatIsIt: [
      "Zinc is a trace mineral involved in over 300 enzymatic reactions in the body. It's critical for immune function, wound healing, DNA synthesis, and cell division.",
      "Even mild zinc deficiency can impair immune responses. Supplementation has been shown to reduce the duration and severity of common colds and support overall immune resilience.",
    ],
    studies: [
      { title: "Zinc lozenges and the common cold", year: "2011", journal: "Open Respiratory Medicine Journal", finding: "Zinc supplementation reduced common cold duration by 33% when taken within 24 hours of symptom onset.", url: "https://pubmed.ncbi.nlm.nih.gov/21769305/" },
    ],
    dose: "10mg",
    doseRationale: "10mg provides meaningful immune support without exceeding safe daily limits. This is aligned with the NHS recommended daily intake for adults.",
    foundIn: [{ product: "IMMUNITY", slug: "immunity" }],
    synergies: [
      { name: "Vitamin C", slug: "vitamin-c", reason: "Zinc and Vitamin C together support multiple arms of the immune system" },
      { name: "Elderberry", slug: "elderberry", reason: "Combined antiviral and immune-stimulating effects" },
    ],
  },
  "chamomile": {
    slug: "chamomile",
    name: "Chamomile",
    benefit: "Promotes relaxation and reduces anxiety without sedation",
    whatIsIt: [
      "Chamomile (Matricaria chamomilla) is one of the world's oldest and most widely used medicinal plants. It's been consumed as a calming tea for thousands of years across Egyptian, Greek, and Roman civilisations.",
      "Its calming effects come from apigenin, a flavonoid that binds to GABA receptors in the brain — the same receptors targeted by anti-anxiety medications, but in a gentle, non-addictive way.",
      "Unlike pharmaceutical sedatives, chamomile promotes relaxation without drowsiness, making it suitable for daytime stress management as well as evening wind-down rituals."
    ],
    studies: [
      { title: "Chamomile: a herbal medicine of the past with bright future", year: "2010", journal: "Molecular Medicine Reports", finding: "Chamomile demonstrated significant anxiolytic and mild sedative effects across multiple clinical models.", url: "https://pubmed.ncbi.nlm.nih.gov/21132119/" },
      { title: "Long-term chamomile therapy for generalized anxiety disorder", year: "2016", journal: "Phytomedicine", finding: "Chamomile significantly reduced anxiety symptoms over 8 weeks, with benefits maintained during follow-up.", sampleSize: "93 adults with GAD", url: "https://pubmed.ncbi.nlm.nih.gov/27912875/" },
    ],
    dose: "150mg",
    doseRationale: "150mg of standardised chamomile extract (1.2% apigenin) matches the effective anxiolytic doses used in clinical trials for generalised anxiety.",
    foundIn: [{ product: "CALM", slug: "calm" }],
    synergies: [
      { name: "Lemon Balm", slug: "lemon-balm", reason: "Both act on GABA pathways but through different mechanisms, amplifying calm without sedation" },
      { name: "Magnesium", slug: "magnesium", reason: "Magnesium relaxes the nervous system, complementing Chamomile's anxiolytic effects" },
    ],
  },
  "lemon-balm": {
    slug: "lemon-balm",
    name: "Lemon Balm",
    benefit: "Calms the nervous system and improves mood",
    whatIsIt: [
      "Lemon Balm (Melissa officinalis) is a fragrant herb from the mint family that has been used for centuries in European herbal medicine to calm nerves, improve sleep, and lift mood.",
      "It works by inhibiting the enzyme GABA-transaminase, which means more calming GABA stays active in your brain for longer. It also has mild cognitive-enhancing properties.",
    ],
    studies: [
      { title: "Pilot trial of Melissa officinalis on stress and anxiety", year: "2011", journal: "Mediterranean Journal of Nutrition and Metabolism", finding: "Lemon Balm reduced anxiety symptoms by 18% and insomnia by 42% over 15 days.", sampleSize: "20 adults", url: "https://pubmed.ncbi.nlm.nih.gov/21130907/" },
      { title: "Attenuation of laboratory-induced stress using Melissa officinalis", year: "2004", journal: "Psychosomatic Medicine", finding: "A single 600mg dose significantly increased calmness and reduced alertness to stress stimuli.", sampleSize: "18 adults", url: "https://pubmed.ncbi.nlm.nih.gov/15272110/" },
    ],
    dose: "150mg",
    doseRationale: "150mg of concentrated lemon balm extract provides effective anxiolytic benefits. Clinical trials showing mood and sleep improvements typically used 150-600mg daily.",
    foundIn: [{ product: "CALM", slug: "calm" }],
    synergies: [
      { name: "Chamomile", slug: "chamomile", reason: "Both calm through GABA modulation via different pathways" },
      { name: "Jujube Seed", slug: "jujube-seed", reason: "Jujube supports deep relaxation while Lemon Balm calms surface anxiety" },
    ],
  },
  "jujube-seed": {
    slug: "jujube-seed",
    name: "Jujube Seed",
    benefit: "Supports deep relaxation and restorative sleep",
    whatIsIt: [
      "Jujube Seed (Ziziphus jujuba) has been used in Traditional Chinese Medicine for over 2,000 years as a premier sleep and anxiety remedy. The seeds of the jujube fruit contain saponins that interact with GABA and serotonin pathways.",
      "It's particularly valued for promoting natural, restorative sleep without morning grogginess — making it a gentler alternative to pharmaceutical sleep aids.",
    ],
    studies: [
      { title: "Jujube seed extract on sleep quality and GABAergic system", year: "2017", journal: "Evidence-Based Complementary and Alternative Medicine", finding: "Jujube seed extract significantly improved sleep quality through GABA receptor modulation.", url: "https://pubmed.ncbi.nlm.nih.gov/28408940/" },
    ],
    dose: "200mg",
    doseRationale: "200mg of jujube seed extract is within the effective range used in traditional formulations and modern research for sleep and anxiety support.",
    foundIn: [{ product: "CALM", slug: "calm" }],
    synergies: [
      { name: "Chamomile", slug: "chamomile", reason: "Chamomile calms anxiety while Jujube promotes deeper, restorative sleep" },
      { name: "Lemon Balm", slug: "lemon-balm", reason: "Together they support both falling asleep and staying calm throughout the day" },
    ],
  },
  "poria-cocos": {
    slug: "poria-cocos",
    name: "Poria Cocos",
    benefit: "Calms the nervous system and supports digestive balance",
    whatIsIt: [
      "Poria Cocos (Fu Ling) is a medicinal mushroom that grows on the roots of pine trees. It's one of the most commonly used herbs in Traditional Chinese Medicine, appearing in more classical formulations than almost any other ingredient.",
      "It's prized for its gentle calming effects on the mind and its ability to support healthy digestion and fluid balance. It works synergistically with other calming herbs to deepen relaxation.",
    ],
    studies: [
      { title: "Poria cocos polysaccharides and their biological activities", year: "2013", journal: "International Journal of Biological Macromolecules", finding: "Poria polysaccharides showed significant anti-inflammatory and immune-modulating effects.", url: "https://pubmed.ncbi.nlm.nih.gov/23416128/" },
    ],
    dose: "200mg",
    doseRationale: "200mg aligns with traditional dosing guidelines and modern research on Poria's calming and digestive benefits.",
    foundIn: [{ product: "CALM", slug: "calm" }],
    synergies: [
      { name: "Chamomile", slug: "chamomile", reason: "Both promote calm through gentle, non-sedating mechanisms" },
      { name: "Jujube Seed", slug: "jujube-seed", reason: "A classic TCM pairing for anxiety and sleep support" },
    ],
  },
  "magnesium": {
    slug: "magnesium",
    name: "Magnesium",
    benefit: "Relaxes muscles and supports the nervous system",
    whatIsIt: [
      "Magnesium is an essential mineral involved in over 600 biochemical reactions in the body. It plays a crucial role in muscle relaxation, nervous system function, and sleep regulation.",
      "An estimated 60% of adults don't get enough magnesium from their diet alone. Deficiency is linked to increased stress, poor sleep, muscle tension, and anxiety — all things that supplementation can meaningfully improve.",
    ],
    studies: [
      { title: "The effect of magnesium supplementation on subjective anxiety and stress", year: "2017", journal: "Nutrients", finding: "Systematic review found magnesium supplementation had a positive effect on subjective anxiety, particularly in vulnerable populations.", url: "https://pubmed.ncbi.nlm.nih.gov/28445426/" },
    ],
    dose: "100mg",
    doseRationale: "100mg of highly bioavailable magnesium glycinate complements dietary intake without exceeding recommended supplemental limits.",
    foundIn: [{ product: "CALM", slug: "calm" }],
    synergies: [
      { name: "Chamomile", slug: "chamomile", reason: "Chamomile calms the mind while Magnesium relaxes the body" },
      { name: "Lemon Balm", slug: "lemon-balm", reason: "Together they provide comprehensive stress relief across mind and body" },
    ],
  },
  "marine-collagen": {
    slug: "marine-collagen",
    name: "Marine Collagen",
    benefit: "Supports skin elasticity, hydration, hair and nail strength",
    whatIsIt: [
      "Marine Collagen is a type I collagen sourced from sustainably managed fish. Type I collagen is the most abundant protein in human skin, making marine-derived collagen peptides the most bioavailable form for skin health.",
      "As we age, our natural collagen production declines by about 1% per year after age 25. Supplementing with collagen peptides has been shown to stimulate the body's own collagen production, improving skin firmness, hydration, and reducing fine lines.",
      "Marine collagen peptides are broken down into smaller molecules that are easily absorbed, with studies showing measurable improvements in skin elasticity within 4-8 weeks of daily use."
    ],
    studies: [
      { title: "Oral collagen supplementation: a systematic review", year: "2014", journal: "Journal of Drugs in Dermatology", finding: "Oral collagen peptides significantly improved skin elasticity and hydration after 8 weeks of daily supplementation.", url: "https://pubmed.ncbi.nlm.nih.gov/23949208/" },
      { title: "Ingestion of bioactive collagen peptides on skin properties", year: "2014", journal: "Skin Pharmacology and Physiology", finding: "Collagen supplementation reduced skin wrinkle volume by 20% and increased skin procollagen by 65%.", sampleSize: "114 women aged 45-65", url: "https://pubmed.ncbi.nlm.nih.gov/24401291/" },
    ],
    dose: "2,500mg",
    doseRationale: "2,500mg of hydrolysed marine collagen peptides matches the doses used in major skin health trials. Most studies showing significant results used 2,500–5,000mg daily.",
    foundIn: [{ product: "GLOW", slug: "glow" }],
    synergies: [
      { name: "Vitamin C", slug: "vitamin-c", reason: "Vitamin C is essential for collagen synthesis — without it, the body can't effectively use collagen" },
      { name: "Hyaluronic Acid", slug: "hyaluronic-acid", reason: "Collagen provides structure while Hyaluronic Acid provides hydration — together they restore skin from within" },
    ],
  },
  "hyaluronic-acid": {
    slug: "hyaluronic-acid",
    name: "Hyaluronic Acid",
    benefit: "Retains moisture for plump, hydrated skin",
    whatIsIt: [
      "Hyaluronic Acid (HA) is a naturally occurring molecule in your skin that can hold up to 1,000 times its weight in water. It's the reason youthful skin looks plump and dewy.",
      "Like collagen, your body's HA production declines with age. Oral supplementation has been shown to increase skin moisture from within, complementing topical products that only work on the surface.",
    ],
    studies: [
      { title: "Oral hyaluronic acid supplementation for skin moisturizing", year: "2014", journal: "Nutrition Journal", finding: "Oral HA supplementation improved skin moisture content and reduced wrinkle depth after 8 weeks.", sampleSize: "39 women", url: "https://pubmed.ncbi.nlm.nih.gov/25014997/" },
    ],
    dose: "120mg",
    doseRationale: "120mg of low-molecular-weight hyaluronic acid (for better absorption) is aligned with clinical studies demonstrating skin hydration and anti-wrinkle effects.",
    foundIn: [{ product: "GLOW", slug: "glow" }],
    synergies: [
      { name: "Marine Collagen", slug: "marine-collagen", reason: "Collagen builds structure, HA provides hydration — the foundation of youthful skin" },
      { name: "Vitamin C", slug: "vitamin-c", reason: "Vitamin C's antioxidant protection preserves the HA your body already produces" },
    ],
  },
  "coq10": {
    slug: "coq10",
    name: "CoQ10",
    benefit: "Supports cellular energy and antioxidant protection",
    whatIsIt: [
      "Coenzyme Q10 (CoQ10) is a naturally occurring compound found in every cell of your body. It plays a critical role in mitochondrial energy production — essentially helping your cells generate the energy they need to function and repair.",
      "CoQ10 levels naturally decline with age, which is linked to reduced cellular energy, increased oxidative damage, and visible signs of ageing. Supplementation has been shown to support skin health, energy levels, and cardiovascular function.",
    ],
    studies: [
      { title: "CoQ10 and skin ageing", year: "2015", journal: "BioFactors", finding: "CoQ10 supplementation reduced visible signs of ageing by supporting cellular energy production and reducing oxidative stress.", url: "https://pubmed.ncbi.nlm.nih.gov/25919144/" },
    ],
    dose: "80mg",
    doseRationale: "80mg of ubiquinol (the active form of CoQ10) provides meaningful antioxidant and cellular energy support, consistent with dermatological research.",
    foundIn: [{ product: "GLOW", slug: "glow" }],
    synergies: [
      { name: "Marine Collagen", slug: "marine-collagen", reason: "CoQ10 provides the cellular energy needed for collagen synthesis" },
      { name: "Resveratrol", slug: "resveratrol", reason: "Both are powerful antioxidants that protect skin from different types of damage" },
    ],
  },
  "resveratrol": {
    slug: "resveratrol",
    name: "Resveratrol",
    benefit: "Protects against oxidative skin damage and supports healthy ageing",
    whatIsIt: [
      "Resveratrol is a polyphenol found naturally in red grapes, berries, and peanuts. It gained fame as the compound thought to explain the 'French Paradox' — why the French have lower rates of heart disease despite a rich diet.",
      "It's a potent antioxidant that activates sirtuins — proteins involved in cellular repair and longevity. For skin, it protects against UV-induced damage and supports cellular rejuvenation.",
    ],
    studies: [
      { title: "Resveratrol and skin disorders", year: "2014", journal: "Annals of the New York Academy of Sciences", finding: "Resveratrol showed significant photoprotective and anti-ageing effects on skin through multiple pathways.", url: "https://pubmed.ncbi.nlm.nih.gov/24329018/" },
    ],
    dose: "100mg",
    doseRationale: "100mg of trans-resveratrol (the bioactive form) provides meaningful antioxidant protection, aligned with research on skin health and cellular longevity.",
    foundIn: [{ product: "GLOW", slug: "glow" }],
    synergies: [
      { name: "CoQ10", slug: "coq10", reason: "Both antioxidants protect cells from different types of oxidative damage" },
      { name: "Marine Collagen", slug: "marine-collagen", reason: "Resveratrol protects collagen from UV-induced breakdown" },
    ],
  },
  "selenium": {
    slug: "selenium",
    name: "Selenium",
    benefit: "Protects cells from oxidative stress",
    whatIsIt: [
      "Selenium is an essential trace mineral that plays a key role in antioxidant defence, thyroid function, and DNA synthesis. It's a component of selenoproteins, which protect cells from oxidative damage.",
      "For skin health, selenium works as part of the body's glutathione peroxidase system — one of the most important internal antioxidant defences. It helps protect skin from UV damage and supports healthy ageing.",
    ],
    studies: [
      { title: "Selenium in dermatology", year: "2015", journal: "Dermatology and Therapy", finding: "Selenium supplementation supported skin health through antioxidant defence and immune function.", url: "https://pubmed.ncbi.nlm.nih.gov/26537957/" },
    ],
    dose: "55µg",
    doseRationale: "55µg matches the recommended daily intake and provides effective antioxidant support without exceeding safe upper limits.",
    foundIn: [{ product: "GLOW", slug: "glow" }],
    synergies: [
      { name: "Vitamin C", slug: "vitamin-c", reason: "Selenium and Vitamin C work together in the body's antioxidant defence network" },
      { name: "CoQ10", slug: "coq10", reason: "Multiple antioxidants provide broader cellular protection than any single compound" },
    ],
  },
};

export const ingredientSlugs = Object.keys(ingredients);
export const getIngredient = (slug: string) => ingredients[slug];
