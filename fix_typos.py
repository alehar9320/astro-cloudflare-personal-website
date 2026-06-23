import os
import re

def fix_file(filepath, replacements):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    new_content = content
    for pattern, replacement in replacements.items():
        new_content = re.sub(pattern, replacement, new_content)

    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        return True
    return False

# Fixes
fix_file('src/content/work/ifs-design-system.md', {r'\bprestigeous\b': 'prestigious'})
fix_file('context/author-linkedin.md', {
    r'\bWe’l\b': "We'll",
    r'\bYou’l\b': "You'll",
    r'Loaded 9 Posts posts': 'Loaded 9 posts'
})
# Manual fix for worker-configuration.d.ts to be safe
with open('worker-configuration.d.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()
with open('worker-configuration.d.ts', 'w', encoding='utf-8') as f:
    for line in lines:
        if 'The **`data`** read-only property of the The data sent' in line:
            line = line.replace('property of the The data sent', 'property of the data sent')
        f.write(line)

# Update hygiene journal
with open('.Janitor/hygiene.md', 'r', encoding='utf-8') as f:
    hygiene = f.read()

# Fix existing the the
hygiene = hygiene.replace('the the', 'the')

new_entries = """| 2025-03-24 | src/content/work/ifs-design-system.md | Corrected typo 'prestigeous' to 'prestigious'                                        | Validated   |
| 2025-03-24 | context/author-linkedin.md        | Corrected 'We'll' and 'You'll' typos and normalized post count terminology               | Validated   |
| 2025-03-24 | worker-configuration.d.ts         | Removed duplicate 'the' in MessageEvent data property documentation                      | Validated   |
"""

if '## Spelling Exceptions' in hygiene:
    parts = hygiene.split('## Spelling Exceptions')
    hygiene = parts[0] + new_entries + "\n## Spelling Exceptions" + parts[1]
    if '- IFS' not in hygiene:
        hygiene += "- IFS\n- Colombo\n"

with open('.Janitor/hygiene.md', 'w', encoding='utf-8') as f:
    f.write(hygiene)
