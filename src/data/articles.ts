export interface Article {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  publishedAt: string;
  updatedAt: string;
  readingTime: string;
  category: string;
  relatedProduct?: { slug: string; name: string };
  content: string; // HTML string
}

export const articles: Article[] = [
  {
    slug: 'does-lions-mane-actually-work',
    title: "Does Lion's Mane Actually Work? The Science Behind the Hype",
    description: "Lion's Mane mushroom is everywhere right now — but does it actually improve focus and memory? We break down the clinical research, the real dosing, and what to expect.",
    keywords: ["lion's mane benefits", "does lion's mane work", "lion's mane mushroom UK", "lion's mane cognitive", "hericium erinaceus research", "lion's mane supplement"],
    publishedAt: '2026-05-01',
    updatedAt: '2026-05-01',
    readingTime: '6 min read',
    category: 'Ingredients',
    relatedProduct: { slug: 'focus', name: 'NECTA FOCUS' },
    content: `
<h2>What Is Lion's Mane?</h2>
<p>Lion's Mane (<em>Hericium erinaceus</em>) is a medicinal mushroom that has been used in traditional Chinese medicine for centuries. It gets its name from its distinctive shaggy appearance — cascading white tendrils that look like, well, a lion's mane. Today it's one of the most researched nootropic ingredients in the world.</p>
<p>Unlike caffeine, which gives you a short spike and a crash, Lion's Mane works cumulatively to support your brain's natural chemistry. That makes it a very different kind of cognitive tool.</p>

<h2>The Key Compounds: NGF and BDNF</h2>
<p>Lion's Mane contains two unique groups of compounds: <strong>hericenones</strong> (found in the fruiting body) and <strong>erinacines</strong> (found in the mycelium). Both have been shown in laboratory and human studies to stimulate the production of <strong>Nerve Growth Factor (NGF)</strong> — a protein that is critical for the growth, maintenance, and survival of neurons.</p>
<p>NGF plays a major role in neuroplasticity — your brain's ability to form new connections. This is what underlies learning, memory formation, and recovery from cognitive fatigue.</p>
<p>Lion's Mane has also been shown to support <strong>Brain-Derived Neurotrophic Factor (BDNF)</strong>, sometimes called "fertiliser for the brain." Low BDNF is associated with brain fog, depression, and cognitive decline.</p>

<h2>What Does the Clinical Research Say?</h2>
<p>Several human trials have examined Lion's Mane's effects on cognition:</p>
<ul>
  <li><strong>Mori et al. (2009)</strong> — a randomised double-blind placebo-controlled trial in Japanese adults with mild cognitive impairment found that 3g of Lion's Mane daily for 16 weeks led to significantly improved cognitive function scores compared to placebo. Scores declined after supplementation stopped.</li>
  <li><strong>Nagano et al. (2010)</strong> — a randomised trial found significant reductions in anxiety and depression scores after 4 weeks of Lion's Mane supplementation in women.</li>
  <li><strong>Chong et al. (2019)</strong> — a systematic review concluded Lion's Mane shows promise for improving mild cognitive impairment and early Alzheimer's symptoms.</li>
</ul>
<p>Most studies use doses of 500mg–3g of fruiting body extract per day. NECTA FOCUS contains 500mg per serving — the clinically studied minimum effective dose.</p>

<h2>How Quickly Does Lion's Mane Work?</h2>
<p>This is where people get frustrated. Lion's Mane is not like caffeine. You won't feel it after one dose. Most clinical trials show meaningful effects after <strong>4–16 weeks of consistent daily use</strong>. Think of it like exercise — you don't get fit after one session. You build the benefit over time.</p>
<p>That said, many users report a subtle sense of mental clarity within the first 1–2 weeks. This is likely due to NGF accumulation beginning relatively quickly once supplementation starts.</p>

<h2>Who Should Take Lion's Mane?</h2>
<p>Lion's Mane is particularly well-suited for:</p>
<ul>
  <li>People who experience brain fog or mental fatigue</li>
  <li>Anyone who wants to support long-term cognitive health</li>
  <li>Students and professionals who need sustained focus without stimulants</li>
  <li>People reducing caffeine dependence</li>
</ul>
<p>It is generally considered safe for daily use. Lion's Mane is well-tolerated with no significant adverse effects reported in clinical literature. Always consult a healthcare professional if you are pregnant, breastfeeding, or on medication.</p>

<h2>Does It Stack With Other Ingredients?</h2>
<p>Yes — and this is where it gets interesting. Lion's Mane works synergistically with <strong>L-Theanine</strong>, which promotes calm alertness and reduces the background mental noise that gets in the way of focus. Rhodiola Rosea adds adaptogenic stress-buffering, helping maintain mental performance under pressure.</p>
<p>This trio — Lion's Mane, L-Theanine, and Rhodiola — is exactly what NECTA FOCUS is built around.</p>

<h2>What to Look For in a Lion's Mane Supplement</h2>
<p>Not all Lion's Mane supplements are equal. Key things to check:</p>
<ul>
  <li><strong>Fruiting body vs mycelium</strong> — fruiting body contains higher concentrations of the active hericenones. Many cheap products use mycelium grown on grain, which is mostly starch.</li>
  <li><strong>Dose</strong> — clinical studies use 500mg–3g. Products with less than 250mg are likely underdosed.</li>
  <li><strong>Extraction method</strong> — hot water or dual extraction (hot water + alcohol) is needed to access the full range of bioactive compounds.</li>
</ul>

<h2>The Bottom Line</h2>
<p>Lion's Mane has more robust human clinical trial evidence behind it than almost any other nootropic supplement. It genuinely supports neuroplasticity, NGF production, and long-term cognitive health. It is not a quick fix — it is a daily habit that compounds over weeks and months. At 500mg per day in a form your brain can actually use, it's one of the most valuable things you can add to your morning routine.</p>
    `,
  },
  {
    slug: 'best-adaptogens-for-stress-anxiety',
    title: 'Best Adaptogens for Stress and Anxiety in 2026',
    description: "From ashwagandha to rhodiola, we rank the best adaptogens for stress relief and anxiety based on clinical evidence — and explain how to actually use them.",
    keywords: ['adaptogens for stress', 'best adaptogen UK', 'ashwagandha for anxiety', 'rhodiola rosea stress', 'natural stress relief supplements UK', 'adaptogen supplement 2026'],
    publishedAt: '2026-05-03',
    updatedAt: '2026-05-03',
    readingTime: '7 min read',
    category: 'Wellness',
    relatedProduct: { slug: 'calm', name: 'NECTA CALM' },
    content: `
<h2>What Are Adaptogens?</h2>
<p>Adaptogens are a class of herbs and mushrooms that help your body adapt to stress — physical, mental, and environmental. The term was coined by Soviet scientist Nikolai Lazarev in 1947, originally to describe compounds that could increase non-specific resistance to stress in soldiers.</p>
<p>To qualify as an adaptogen, a substance must: (1) be non-toxic at normal doses, (2) help the body resist stress regardless of type, and (3) normalise physiological function without causing more imbalance. They work primarily by modulating the HPA axis — your body's hormonal stress response system — and by supporting neurotransmitter balance.</p>

<h2>1. Ashwagandha (KSM-66) — Best for Cortisol and Chronic Stress</h2>
<p>Ashwagandha (<em>Withania somnifera</em>) is the most extensively studied adaptogen for stress. The KSM-66 extract — a full-spectrum root extract standardised to 5% withanolides — has been tested in multiple double-blind randomised trials.</p>
<p>A 2019 study published in <em>Medicine</em> found that 240mg of KSM-66 daily for 60 days significantly reduced serum cortisol, perceived stress, anxiety, and depression scores compared to placebo. A 2012 study in the <em>Indian Journal of Psychological Medicine</em> used 300mg twice daily with similar results.</p>
<p><strong>Best for:</strong> Chronic stress, elevated cortisol, anxiety, sleep disruption caused by stress</p>
<p><strong>Typical effective dose:</strong> 300–600mg of KSM-66 extract daily</p>

<h2>2. Rhodiola Rosea — Best for Mental Performance Under Pressure</h2>
<p>Rhodiola (<em>Rhodiola rosea</em>) is a Scandinavian root that has been used for centuries to combat fatigue at altitude and in extreme cold. It works differently from ashwagandha — rather than lowering cortisol, it improves your brain's efficiency and reduces the mental fatigue that comes from sustained cognitive effort.</p>
<p>A 2009 trial published in <em>Phytomedicine</em> found Rhodiola reduced burnout symptoms and improved attention, cognitive function, and work performance in physicians on night duty. Another study found significant improvements in mental fatigue and academic performance in students during exam periods.</p>
<p>Rhodiola is particularly valuable for people who need to perform mentally when under pressure — tight deadlines, public speaking, high-stakes decisions.</p>
<p><strong>Best for:</strong> Mental fatigue, exam stress, burnout, performance under pressure</p>
<p><strong>Typical effective dose:</strong> 200–400mg of standardised extract (3% rosavins, 1% salidroside)</p>

<h2>3. Lemon Balm — Best for Acute Anxiety Without Sedation</h2>
<p>Lemon Balm (<em>Melissa officinalis</em>) is a gentle nervine that works within hours rather than weeks. It inhibits GABA transaminase — the enzyme that breaks down GABA in the brain. GABA is your brain's primary inhibitory neurotransmitter, and low GABA activity is associated with anxiety, restlessness, and poor sleep.</p>
<p>Unlike prescription anxiolytics, Lemon Balm does not cause dependence or significant sedation at recommended doses. A 2014 study found that 300mg of Lemon Balm extract significantly reduced anxiety and insomnia in participants with mild to moderate anxiety disorders.</p>
<p><strong>Best for:</strong> Daily anxiety management, social anxiety, pre-event nerves, wind-down after a stressful day</p>
<p><strong>Typical effective dose:</strong> 300–600mg of standardised extract</p>

<h2>4. Chamomile — Best for Generalised Anxiety Over Time</h2>
<p>Chamomile (<em>Matricaria chamomilla</em>) has a longer clinical track record than most people realise. A landmark trial from the University of Pennsylvania found that chamomile extract significantly reduced generalised anxiety disorder (GAD) symptoms over 8 weeks, and a follow-up study found it reduced the rate of relapse.</p>
<p>Chamomile works via multiple mechanisms: it binds to GABA receptors, has anti-inflammatory properties, and modulates the HPA axis. It is one of the safest herbal interventions available — appropriate for long-term daily use.</p>
<p><strong>Best for:</strong> Generalised anxiety, digestive tension caused by stress, long-term daily support</p>
<p><strong>Typical effective dose:</strong> 220–1500mg of extract standardised to 1.2% apigenin</p>

<h2>5. Reishi — Best for Immune-Stress Axis</h2>
<p>Chronic stress suppresses immune function — this is why you often get ill after a high-pressure period. Reishi (<em>Ganoderma lucidum</em>) addresses this directly. It modulates both the immune system and the nervous system, and has been shown to reduce anxiety alongside its well-documented immune benefits.</p>
<p>Reishi contains triterpenes that have a mild anxiolytic effect and polysaccharides that support immune cell activity. It is slower-acting than other adaptogens — benefits build over 4–8 weeks.</p>
<p><strong>Best for:</strong> Stress-related immune suppression, fatigue, people who get ill frequently</p>
<p><strong>Typical effective dose:</strong> 1–3g of fruiting body extract per day</p>

<h2>How to Stack Adaptogens</h2>
<p>The most effective approach is to combine adaptogens that work through different mechanisms. For stress and anxiety specifically:</p>
<ul>
  <li><strong>Ashwagandha + Lemon Balm + Chamomile</strong> — targets cortisol, GABA activity, and long-term HPA modulation simultaneously. This is the combination in <a href="/shop/calm">NECTA CALM</a>.</li>
  <li><strong>Rhodiola + Lion's Mane</strong> — cognitive performance under stress. See <a href="/shop/focus">NECTA FOCUS</a>.</li>
</ul>
<p>The key rule: give adaptogens 4–8 weeks before judging. They are not acute anxiolytics. They are systemic modulators that build benefit over time.</p>

<h2>What to Avoid</h2>
<p>Not all "adaptogen" products on the market are worth your money. Watch out for:</p>
<ul>
  <li>Proprietary blends that hide individual doses (you can't know if the dose is effective)</li>
  <li>Mycelium-on-grain mushroom products (mostly starch, not active compounds)</li>
  <li>Products claiming instant results from adaptogens (that's not how they work)</li>
  <li>Very low doses added for marketing only</li>
</ul>
<p>Always look for products that list exact milligram doses per ingredient and use standardised extracts.</p>
    `,
  },
  {
    slug: 'ashwagandha-in-coffee',
    title: 'Ashwagandha in Coffee: Does It Work and How to Do It Right',
    description: "Adding ashwagandha to coffee is one of the biggest wellness trends right now — but does it actually work, and does heat destroy the benefits? Here's the science.",
    keywords: ['ashwagandha in coffee', 'ashwagandha coffee UK', 'ashwagandha drink', 'ashwagandha latte', 'adaptogen coffee', 'ashwagandha morning routine'],
    publishedAt: '2026-05-05',
    updatedAt: '2026-05-05',
    readingTime: '5 min read',
    category: 'How To',
    relatedProduct: { slug: 'calm', name: 'NECTA CALM' },
    content: `
<h2>Why People Are Putting Ashwagandha in Coffee</h2>
<p>Coffee is the world's most popular psychoactive drug. It works — but it also spikes cortisol, increases anxiety in sensitive individuals, and leads to the familiar afternoon crash. Ashwagandha is an adaptogen shown to reduce cortisol and anxiety. The logic of combining them is sound: use coffee's energy-boosting effects while blunting its stress-inducing downsides.</p>
<p>This is not a new idea — Ayurvedic practitioners have been combining ashwagandha with warm milk for centuries in a preparation called <em>ashwagandha ksheerapaka</em>. The modern "adaptogen coffee" trend is essentially the same concept applied to espresso.</p>

<h2>Does Heat Destroy Ashwagandha's Benefits?</h2>
<p>This is the most common concern, and the answer is: <strong>no, not at normal brewing temperatures</strong>. The active compounds in ashwagandha — primarily withanolides — are stable steroidal lactones that do not degrade at temperatures below 100°C. Your espresso is typically brewed at 90–96°C. Traditional Ayurvedic use involves boiling ashwagandha in milk, which confirms its heat stability.</p>
<p>What matters more than temperature is the <strong>form</strong> of ashwagandha. Ashwagandha root powder has low bioavailability in cold water. A high-quality water-soluble extract (like KSM-66 or Sensoril) is formulated to dissolve and absorb efficiently in both hot and cold liquids.</p>

<h2>The Cortisol-Caffeine Connection</h2>
<p>Caffeine triggers cortisol release via the HPA axis. In healthy adults, morning coffee causes a cortisol spike of roughly 30% above baseline. For most people this is fine — cortisol is naturally high in the morning anyway. But for people who are already chronically stressed, this additional cortisol spike can worsen anxiety, increase heart rate variability, and disrupt sleep if coffee is consumed late in the day.</p>
<p>Ashwagandha directly counteracts this mechanism. KSM-66 at 300–600mg has been shown to reduce serum cortisol by up to 27% in chronically stressed adults. Adding it to your morning coffee essentially smooths the cortisol curve — you still get the alertness from caffeine, but with less of the anxiety edge.</p>

<h2>How to Add Ashwagandha to Coffee</h2>
<p>There are three main approaches:</p>

<h3>1. Ashwagandha powder</h3>
<p>Add ¼–½ teaspoon of ashwagandha root powder to your coffee. Drawbacks: it has an earthy, slightly bitter taste, and powder doesn't dissolve well — you'll notice a gritty residue. The dose from powder is also harder to standardise.</p>

<h3>2. Ashwagandha capsules alongside coffee</h3>
<p>Take a capsule with your morning coffee. Simple and effective — but you miss the convenience of it being in the drink.</p>

<h3>3. Liquid ashwagandha extract (the easiest)</h3>
<p>A pre-formulated liquid extract mixed directly into your coffee is the cleanest approach. It mixes invisibly into hot or cold drinks, the dose is precise, and the taste (if it's a good product) is minimal. This is what <a href="/shop/calm">NECTA CALM</a> is built for — 2 pumps into your morning coffee gives you Ashwagandha 300mg alongside Chamomile and Lemon Balm, all in a formula designed to dissolve instantly into any temperature drink.</p>

<h2>What to Expect</h2>
<p>The effects of ashwagandha in coffee are subtle, especially at first. You are not looking for a dramatic feeling. You are looking for:</p>
<ul>
  <li>Less of the jittery edge from your first coffee</li>
  <li>More sustained energy without the spike and crash</li>
  <li>A gradual reduction in background anxiety over 2–4 weeks</li>
  <li>Better sleep quality over time (due to lower chronic cortisol)</li>
</ul>
<p>Most people notice the difference most clearly when they compare a week of ashwagandha coffee to a week without it, rather than on a day-by-day basis.</p>

<h2>Is It Safe Every Day?</h2>
<p>Yes. Ashwagandha is one of the most extensively safety-tested herbs in traditional and modern medicine. Long-term daily use at 300–600mg is well-supported by clinical literature. The most common side effect is mild digestive upset, which is avoided by taking it with food — i.e., in your morning coffee with breakfast.</p>
<p>Avoid if you have thyroid conditions (ashwagandha has thyroid-modulating effects), are pregnant or breastfeeding, or are on immunosuppressant medication. Consult a GP if in doubt.</p>
    `,
  },
  {
    slug: 'what-is-l-theanine',
    title: "What Is L-Theanine? Why You Feel Calm After Green Tea",
    description: "L-Theanine is the amino acid responsible for the calm focus you feel from green tea. Here's the science on how it works, the right dose, and why it stacks so well with caffeine.",
    keywords: ['what is l-theanine', 'l-theanine benefits', 'l-theanine and caffeine', 'l-theanine anxiety', 'l-theanine green tea', 'l-theanine supplement UK', 'l-theanine focus'],
    publishedAt: '2026-05-07',
    updatedAt: '2026-05-07',
    readingTime: '5 min read',
    category: 'Ingredients',
    relatedProduct: { slug: 'focus', name: 'NECTA FOCUS' },
    content: `
<h2>The Reason Green Tea Feels Different from Coffee</h2>
<p>If you've ever noticed that green tea gives you a gentler, more focused kind of energy than coffee — alert but not anxious, clear-headed but calm — that's L-Theanine at work. L-Theanine is an amino acid found almost exclusively in tea leaves (<em>Camellia sinensis</em>), and it is the primary reason green tea has been associated with meditative focus in Japanese and Chinese culture for centuries.</p>

<h2>How L-Theanine Works in the Brain</h2>
<p>L-Theanine crosses the blood-brain barrier within 30–60 minutes of ingestion. Once there, it works through several mechanisms:</p>
<ul>
  <li><strong>Increases alpha brain wave activity</strong> — alpha waves are associated with relaxed alertness: the mental state you're in when you're focused but not stressed. EEG studies consistently show L-Theanine increases alpha wave amplitude within 45 minutes of consumption.</li>
  <li><strong>Modulates GABA</strong> — L-Theanine has a mild agonist effect at GABA receptors, producing anxiolytic (anti-anxiety) effects without sedation.</li>
  <li><strong>Reduces glutamate excitotoxicity</strong> — glutamate is an excitatory neurotransmitter. Too much leads to mental overstimulation. L-Theanine acts as a glutamate receptor antagonist, dampening the excitatory signal.</li>
  <li><strong>Supports dopamine and serotonin</strong> — small but consistent increases in both neurotransmitters have been measured after L-Theanine consumption.</li>
</ul>

<h2>The L-Theanine + Caffeine Stack: Why It Works</h2>
<p>The most well-researched use of L-Theanine is in combination with caffeine, and the synergy is well-documented. Caffeine is a powerful stimulant but it works by blocking adenosine receptors and triggering adrenaline — which is why it can cause anxiety, jitteriness, and a post-caffeine crash.</p>
<p>L-Theanine doesn't block caffeine's energising effects — it modulates the overstimulation. The result is:</p>
<ul>
  <li>The alertness and energy of caffeine</li>
  <li>Without the anxiety or racing mind</li>
  <li>With a smoother, more sustained focus state</li>
</ul>
<p>Multiple randomised controlled trials confirm that the combination improves attention, reaction time, and working memory more than either compound alone. The commonly studied ratio is approximately 2:1 L-Theanine to caffeine — so 80–100mg L-Theanine with a standard 40–50mg caffeine espresso.</p>

<h2>What Dose Actually Works?</h2>
<p>Clinical studies have used doses ranging from 50mg to 400mg. The sweet spot for most people is <strong>50–200mg</strong>. Below 50mg the effect is minimal. Above 200mg you may notice a relaxing effect that some people find too sedating for daytime use.</p>
<p>A standard cup of matcha contains roughly 20–40mg of L-Theanine. A green tea bag contains 10–20mg. These are real but low doses — which is why dedicated supplementation at 80mg+ produces more consistent results.</p>
<p>NECTA FOCUS contains 80mg per serving — the minimum dose shown to produce measurable alpha wave increases and anxiety reduction in human trials.</p>

<h2>Is L-Theanine Safe?</h2>
<p>L-Theanine has one of the cleanest safety profiles of any supplement studied. It is classified as GRAS (Generally Recognised As Safe) by the FDA. No serious adverse effects have been reported in clinical literature even at doses up to 900mg. It is non-habit-forming and does not cause dependence or withdrawal.</p>
<p>The only caution: if you take blood pressure medication, L-Theanine may have additive blood pressure-lowering effects. Consult your GP if relevant.</p>

<h2>When to Take L-Theanine</h2>
<p>For focus and cognitive performance: take it with your morning coffee (2:1 ratio relative to caffeine). For relaxation without sedation: take it in the afternoon as a standalone. For sleep quality: some people find 100–200mg before bed helps quiet racing thoughts.</p>
<p>Unlike most adaptogens, L-Theanine is fast-acting — effects begin within 30–60 minutes and last 4–6 hours. It works on the first dose, and consistent daily use appears to produce stable long-term benefits to anxiety and mood.</p>
    `,
  },
  {
    slug: 'reishi-mushroom-benefits',
    title: 'Reishi Mushroom Benefits: The Most Researched Medicinal Mushroom',
    description: "Reishi has been called the 'mushroom of immortality' for 2,000 years. Here's what the modern clinical evidence says about its immune, stress, and sleep benefits.",
    keywords: ['reishi mushroom benefits', 'reishi supplement UK', 'ganoderma lucidum benefits', 'medicinal mushroom supplement', 'reishi immune system', 'reishi sleep benefits', 'reishi mushroom UK'],
    publishedAt: '2026-05-09',
    updatedAt: '2026-05-09',
    readingTime: '6 min read',
    category: 'Ingredients',
    relatedProduct: { slug: 'immunity', name: 'NECTA IMMUNITY' },
    content: `
<h2>A 2,000-Year Track Record</h2>
<p>Reishi (<em>Ganoderma lucidum</em>) has been used in Chinese and Japanese medicine since at least the first century AD, where it was known as <em>lingzhi</em> — the "mushroom of immortality." It was historically so rare and prized that it appeared on imperial court art and was reserved for emperors.</p>
<p>Today, reishi is cultivated at scale and is one of the most extensively studied medicinal mushrooms in the world. Over 400 bioactive compounds have been identified, and the research base spans thousands of published studies.</p>

<h2>Key Bioactive Compounds</h2>
<p>Reishi's effects come primarily from two compound groups:</p>
<ul>
  <li><strong>Beta-glucans (polysaccharides)</strong> — primarily responsible for immune modulation. Beta-glucans bind to pattern recognition receptors on immune cells (particularly macrophages and natural killer cells), priming them for faster, more targeted responses.</li>
  <li><strong>Triterpenes (ganoderic acids)</strong> — responsible for reishi's anti-inflammatory, adaptogenic, and mild anxiolytic effects. Also thought to contribute to its liver-protective properties.</li>
</ul>
<p>The balance and concentration of these compounds varies significantly by growing conditions, extraction method, and which part of the mushroom is used. Fruiting body extracts contain higher concentrations of both compound classes than mycelium grown on grain substrates.</p>

<h2>Immune Benefits: What the Research Shows</h2>
<p>Reishi is perhaps best supported by evidence for its immune effects. Key findings:</p>
<ul>
  <li>A 2006 randomised trial in cancer patients found reishi extract significantly increased natural killer cell activity and lymphocyte count after 12 weeks.</li>
  <li>Multiple trials have found reishi increases production of interleukins and tumour necrosis factor — cytokines critical for immune coordination.</li>
  <li>A meta-analysis published in the <em>Cochrane Database of Systematic Reviews</em> found positive effects on immune biomarkers across multiple studies.</li>
</ul>
<p>Importantly, reishi is an immune <em>modulator</em>, not simply an immune stimulator. This means it helps bring an underactive immune system up — but also helps regulate an overactive one. This is relevant for people with autoimmune conditions (consult your doctor).</p>

<h2>Stress and Adaptogenic Effects</h2>
<p>Reishi's triterpenes have demonstrated adaptogenic activity — meaning they help the body maintain homeostasis under stress. Specific mechanisms include:</p>
<ul>
  <li>Modulation of cortisol response via HPA axis regulation</li>
  <li>Mild GABAergic activity (reduces excitatory signalling)</li>
  <li>Anti-inflammatory effects in the central nervous system</li>
</ul>
<p>A 2012 study in breast cancer survivors (a group with high stress burden) found significant reductions in fatigue and anxiety after 4 weeks of reishi supplementation.</p>

<h2>Sleep Quality</h2>
<p>Multiple studies suggest reishi may improve sleep quality, particularly in people with stress-related sleep disruption. A 2012 trial in rats showed reishi extract significantly increased non-REM sleep duration. Human studies have shown subjective improvements in sleep quality and reductions in time to sleep onset.</p>
<p>The likely mechanism is a combination of its GABAergic activity (promotes sleep initiation) and its stress-reducing effects (reduces the elevated cortisol that disrupts sleep architecture).</p>

<h2>How Much Reishi Do You Actually Need?</h2>
<p>This is where most commercial products fall short. Clinical studies typically use <strong>1–3g of fruiting body extract per day</strong>. Many products contain 150–300mg — not enough to achieve the effects seen in trials.</p>
<p>NECTA IMMUNITY contains 2g of reishi per serving — within the clinically studied range. This is paired with Elderberry 500mg (antioxidant immune support) and Ashwagandha 300mg (cortisol modulation), creating a comprehensive daily immune and resilience formula.</p>

<h2>Safety and Interactions</h2>
<p>Reishi is generally very well tolerated. Mild digestive upset can occur at high doses — starting with a lower dose and building up helps. Do not take reishi if you are on anticoagulant medication (blood thinners), as reishi has mild blood-thinning effects that may potentiate the drug's action. As with all supplements, consult a GP if pregnant, breastfeeding, or on prescription medication.</p>
    `,
  },
  {
    slug: 'marine-collagen-vs-plant-collagen',
    title: 'Marine Collagen vs Plant Collagen: Which Is Actually Better for Skin?',
    description: "Marine collagen and plant collagen are both trending — but they work very differently. Here's an honest breakdown based on the clinical evidence for skin, joints, and absorption.",
    keywords: ['marine collagen benefits', 'marine collagen vs plant collagen', 'best collagen supplement UK', 'collagen for skin UK', 'marine collagen supplement', 'collagen drink UK', 'collagen absorption'],
    publishedAt: '2026-05-11',
    updatedAt: '2026-05-11',
    readingTime: '6 min read',
    category: 'Ingredients',
    relatedProduct: { slug: 'glow', name: 'NECTA GLOW' },
    content: `
<h2>First, What Is Collagen?</h2>
<p>Collagen is the most abundant protein in the human body — it forms the structural scaffold of skin, tendons, ligaments, cartilage, and bone. In skin specifically, collagen provides tensile strength and elasticity. Type I collagen makes up roughly 80% of skin collagen and is the primary type responsible for its firmness and youthful appearance.</p>
<p>From our mid-twenties, collagen production declines by approximately 1% per year. UV exposure, smoking, high sugar intake, and stress accelerate this decline. The visible result is reduced skin elasticity, fine lines, and the loss of the plump quality associated with younger skin.</p>

<h2>What Is Marine Collagen?</h2>
<p>Marine collagen is extracted from fish skin and scales — primarily from species like cod, tilapia, and salmon. It is overwhelmingly Type I collagen — the same type that makes up most of human skin. Marine collagen peptides are produced by hydrolysis, breaking the collagen protein into smaller peptide fragments (typically 2–5kDa) that are small enough to be absorbed through the gut wall and into the bloodstream.</p>
<p>Once absorbed, collagen peptides do two things: they provide amino acids directly for collagen synthesis (particularly glycine, proline, and hydroxyproline), and they act as signalling molecules that stimulate fibroblasts — the cells responsible for producing new collagen — to upregulate production.</p>

<h2>What Is Plant Collagen?</h2>
<p>Here is where the marketing gets murky. <strong>There is no collagen in plants.</strong> Plants do not produce collagen — it is an exclusively animal protein. "Plant collagen" products are one of two things:</p>
<ol>
  <li><strong>Collagen boosters</strong> — vitamin C, silica, and other plant compounds that support your body's own collagen synthesis. These are real and valuable, but they are not collagen.</li>
  <li><strong>Vegan collagen</strong> — lab-produced recombinant human collagen using yeast or bacteria. This is emerging technology and not yet commercially available at scale in supplements.</li>
</ol>
<p>The honest answer is: if a product says "plant collagen," it is most likely a collagen-supporting formula, not actual collagen. Read the label carefully.</p>

<h2>The Clinical Evidence for Marine Collagen</h2>
<p>Marine collagen has a strong body of human clinical evidence, particularly for skin:</p>
<ul>
  <li><strong>Proksch et al. (2014)</strong> — a randomised double-blind trial found that 2.5g of hydrolysed marine collagen daily for 8 weeks significantly improved skin elasticity compared to placebo. A follow-up study confirmed effects on skin hydration and dermal collagen density.</li>
  <li><strong>Bolke et al. (2019)</strong> — a 12-week trial found marine collagen (combined with hyaluronic acid and other co-factors) significantly reduced wrinkle depth and improved skin hydration.</li>
  <li><strong>Kim et al. (2018)</strong> — found improvements in skin moisture content and surface roughness after 12 weeks of daily marine collagen supplementation.</li>
</ul>
<p>The consistent finding across trials is that <strong>2.5–10g per day for 8–12 weeks</strong> produces measurable improvements in skin elasticity, hydration, and fine line appearance.</p>

<h2>Absorption: Marine Collagen Wins Clearly</h2>
<p>Marine collagen peptides have a molecular weight of approximately 500 Da — significantly smaller than bovine collagen peptides, which typically range from 1,000–3,000 Da. Smaller molecular weight means:</p>
<ul>
  <li>Higher bioavailability — more of what you consume is actually absorbed</li>
  <li>Faster absorption — appears in blood within 1 hour of ingestion</li>
  <li>More efficient delivery to skin, joints, and other tissues</li>
</ul>
<p>Studies using radiolabelled collagen peptides have tracked marine collagen fragments all the way to the dermis — confirming it actually reaches the skin tissue rather than being broken down entirely in digestion.</p>

<h2>Who Should Use Plant-Based Collagen Support Instead?</h2>
<p>If you are vegan or vegetarian, marine collagen is not an option. The practical alternative is to optimise your body's own collagen synthesis through:</p>
<ul>
  <li><strong>Vitamin C</strong> — essential cofactor for collagen synthesis. Deficiency directly impairs collagen production.</li>
  <li><strong>Silica</strong> — found in horsetail extract; supports collagen cross-linking</li>
  <li><strong>Zinc</strong> — required for the enzymes that build collagen structures</li>
  <li><strong>Antioxidants</strong> — protect existing collagen from breakdown by free radicals</li>
</ul>
<p>NECTA GLOW contains Marine Collagen 2.5g alongside Hyaluronic Acid 120mg and CoQ10 80mg — two compounds that work synergistically with collagen for skin hydration and antioxidant protection. We are developing a vegan GLOW formulation for Phase 2.</p>

<h2>The Bottom Line</h2>
<p>If skin health is your goal and you consume animal products, <strong>marine collagen at 2.5g+ per day is the most evidence-backed option available</strong>. It is better absorbed than bovine collagen, has stronger clinical trial evidence for skin specifically, and is more sustainably sourced when produced from fish processing by-products.</p>
<p>Plant collagen is a marketing term for what is really a collagen-supporting formula — legitimate and useful, but not the same thing. Both have a role, but know what you're buying.</p>
    `,
  },
];

export function getArticle(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export function getAllArticles(): Article[] {
  return articles;
}
