
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	type MatcherParam<M> = M extends (param : string) => param is (infer U extends string) ? U : string;

	export interface AppTypes {
		RouteId(): "/" | "/deck" | "/deck/[id]" | "/deck/[id]/edit" | "/settings" | "/study" | "/study/[id]" | "/study/[id]/results";
		RouteParams(): {
			"/deck/[id]": { id: string };
			"/deck/[id]/edit": { id: string };
			"/study/[id]": { id: string };
			"/study/[id]/results": { id: string }
		};
		LayoutParams(): {
			"/": { id?: string | undefined };
			"/deck": { id?: string | undefined };
			"/deck/[id]": { id: string };
			"/deck/[id]/edit": { id: string };
			"/settings": Record<string, never>;
			"/study": { id?: string | undefined };
			"/study/[id]": { id: string };
			"/study/[id]/results": { id: string }
		};
		Pathname(): "/" | `/deck/${string}` & {} | `/deck/${string}/edit` & {} | "/settings" | `/study/${string}` & {} | `/study/${string}/results` & {};
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/apple-touch-icon.png" | "/favicon.svg" | "/icon-192.png" | "/icon-512-maskable.png" | "/icon-512.png" | "/manifest.json" | string & {};
	}
}