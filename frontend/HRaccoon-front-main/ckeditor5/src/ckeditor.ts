/**
 * @license Copyright (c) 2014-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

import { ClassicEditor } from '@ckeditor/ckeditor5-editor-classic'

import { Autoformat } from '@ckeditor/ckeditor5-autoformat'
import { Bold, Italic } from '@ckeditor/ckeditor5-basic-styles'
import { BlockQuote } from '@ckeditor/ckeditor5-block-quote'
import type { EditorConfig } from '@ckeditor/ckeditor5-core'
import { Essentials } from '@ckeditor/ckeditor5-essentials'
import { Heading } from '@ckeditor/ckeditor5-heading'
import { Highlight } from '@ckeditor/ckeditor5-highlight'
import { GeneralHtmlSupport } from '@ckeditor/ckeditor5-html-support'
import { Indent } from '@ckeditor/ckeditor5-indent'
import { Link } from '@ckeditor/ckeditor5-link'
import { List } from '@ckeditor/ckeditor5-list'
import { Markdown } from '@ckeditor/ckeditor5-markdown-gfm'
import { Paragraph } from '@ckeditor/ckeditor5-paragraph'
import { Table, TableToolbar } from '@ckeditor/ckeditor5-table'
import { TextTransformation } from '@ckeditor/ckeditor5-typing'
import { Undo } from '@ckeditor/ckeditor5-undo'

// You can read more about extending the build with additional plugins in the "Installing plugins" guide.
// See https://ckeditor.com/docs/ckeditor5/latest/installation/plugins/installing-plugins.html for details.

class Editor extends ClassicEditor {
	public static override builtinPlugins = [
		Autoformat,
		BlockQuote,
		Bold,
		Essentials,
		GeneralHtmlSupport,
		Heading,
		Highlight,
		Indent,
		Italic,
		Link,
		List,
		Markdown,
		Paragraph,
		Table,
		TableToolbar,
		TextTransformation,
		Undo
	];

	public static override defaultConfig: EditorConfig = {
		toolbar: {
			items: [
				'heading',
				'|',
				'bold',
				'italic',
				'link',
				'bulletedList',
				'numberedList',
				'|',
				'outdent',
				'indent',
				'|',
				'blockQuote',
				'highlight',
				'insertTable',
				'undo',
				'redo'
			]
		},
		language: 'ko',
		table: {
			contentToolbar: [
				'tableColumn',
				'tableRow',
				'mergeTableCells'
			]
		}
	};
}

export default Editor;
