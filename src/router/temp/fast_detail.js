const detail = [
	{
		"path": "/icon",
		"component": () => import( '@/components/page/Icon.vue' ),
		"meta": {
			"title": "自定义图标"
		}
	},
	{
		"path": "/table",
		"component": () => import( '@/components/page/BaseTable.vue' ),
		"meta": {
			"title": "基础表格"
		}
	},
	{
		"path": "/tabs",
		"component": () => import( '@/components/page/Tabs.vue' ),
		"meta": {
			"title": "tab选项卡"
		}
	},
	{
		"path": "/form",
		"component": () => import( '@/components/page/BaseForm.vue' ),
		"meta": {
			"title": "基本表单"
		}
	},
	{
		"path": "/editor",
		"component": () => import( '@/components/page/VueEditor.vue' ),
		"meta": {
			"title": "富文本编辑器"
		}
	},
	{
		"path": "/markdown",
		"component": () => import( '@/components/page/Markdown.vue' ),
		"meta": {
			"title": "markdown编辑器"
		}
	},
	{
		"path": "/upload",
		"component": () => import( '@/components/page/Upload.vue' ),
		"meta": {
			"title": "文件上传"
		}
	},
	{
		"path": "/charts",
		"component": () => import( '@/components/page/BaseCharts.vue' ),
		"meta": {
			"title": "schart图表"
		}
	},
	{
		"path": "/drag",
		"component": () => import( '@/components/page/DragList.vue' ),
		"meta": {
			"title": "拖拽列表"
		}
	},
	{
		"path": "/dialog",
		"component": () => import( '@/components/page/DragDialog.vue' ),
		"meta": {
			"title": "拖拽弹框"
		}
	},
	{
		"path": "/i18n",
		"component": () => import( '@/components/page/I18n.vue' ),
		"meta": {
			"title": "国际化"
		}
	},
	{
		"path": "/permission",
		"component": () => import( '@/components/page/Permission.vue' ),
		"meta": {
			"title": "权限测试",
			"permission": true
		}
	},
	{
		"path": "/404",
		"component": () => import( '@/components/page/404.vue' ),
		"meta": {
			"title": "404"
		}
	},
	{
		"path": "/403",
		"component": () => import( '@/components/page/403.vue' ),
		"meta": {
			"title": "403"
		}
	},
	{
		"path": "/donate",
		"component": () => import( '@/components/page/Donate.vue' ),
		"meta": {
			"title": "支持作者"
		}
	}
] 
export default detail 