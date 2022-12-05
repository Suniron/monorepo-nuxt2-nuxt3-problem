export interface DropdownMenuItem  {
  title: string
  /**
   * mdi icon of dropdown item
   */
  action: string
  items: { title: string; link: string; icon?: string, customImg?: {src: string, alt?: string} }[]
}
