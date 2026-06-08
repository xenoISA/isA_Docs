import { visit } from 'unist-util-visit'

/**
 * remark-brand — edition-agnostic docs content branding (#332).
 *
 * Replaces the literal brand word "isA" in MDX *prose* text with a <BrandShort/>
 * JSX element, which renders the runtime brand (SN, isA, …) from the
 * BrandProvider. This tokenizes the brand at build time so a single docs image
 * rebrands its content by config at runtime — instead of baking "isA" in.
 *
 * Only standalone "isA" is matched (\bisA\b), so code identifiers (isa_agent_sdk),
 * env vars, handles (isA_platform) and ISA* are left untouched. Code/inlineCode
 * are leaf nodes with no text children, so they're never visited.
 */
export default function remarkBrand() {
  return (tree) => {
    visit(tree, 'text', (node, index, parent) => {
      if (!parent || index == null) return
      const parts = node.value.split(/\bisA\b/)
      if (parts.length < 2) return
      const out = []
      parts.forEach((part, i) => {
        if (part) out.push({ type: 'text', value: part })
        if (i < parts.length - 1) {
          out.push({
            type: 'mdxJsxTextElement',
            name: 'BrandShort',
            attributes: [],
            children: [],
          })
        }
      })
      parent.children.splice(index, 1, ...out)
      return ['skip', index + out.length]
    })
  }
}
