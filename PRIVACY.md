# Privacy

The original Python CLI version of SourDough has been retired.

For the current Just Dough It mobile app privacy policy, see [SourDoughMobile/PRIVACY.md](SourDoughMobile/PRIVACY.md).

## Ask the baker (optional)

The bread page can show an "Ask the baker" box for questions about the lazy
sourdough method. It is off unless you use it: nothing is sent until you
type a question, press **Ask** and agree to the consent note the first time.

**What is sent:** your question (and earlier questions and answers in the
same conversation, which are kept only on the page until you leave it),
this loaf's formula (flour weight, water, starter and salt percentages,
starter hydration), room temperature, baking vessel, the time you started
the mix clock if you did, your device's current time and its time zone.
No location, postcode, water hardness, saved recipes, history, account or
device identifiers are sent.

**To whom:** the request goes to a Cloudflare Pages Function on this
website, which forwards it to [DeepSeek](https://www.deepseek.com/), an AI
service, to write the answer. DeepSeek processes and stores data in the
People's Republic of China under its own
[privacy policy](https://cdn.deepseek.com/policies/en-US/deepseek-privacy-policy.html).

**What we keep:** we store no questions or answers. To limit how often the
service can be used, the function keeps a salted hash of your IP address
(never the address itself) with a count of questions for that day, plus a
site-wide daily count. Both expire after 48 hours.

The full policy is in [SourDoughMobile/PRIVACY.md](SourDoughMobile/PRIVACY.md).
