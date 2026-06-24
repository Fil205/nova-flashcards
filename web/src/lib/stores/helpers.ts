/**
 * Shared async-state helper for stores.
 *
 * Encapsulates the recurring `busy=true; error=null; try/catch(setError+rethrow)/finally(busy=false)`
 * pattern so each store method stays focused on its domain logic.
 *
 * @param setBusy   Setter for the "loading" or "saving" flag (store-specific name).
 * @param setError  Setter for the error string (null = no error).
 * @param errorMsg  Human-readable message written to the store on failure.
 * @param fn        The async operation to run. Its return value is forwarded to the caller.
 */
export async function runWithState<T>(
	setBusy:  (v: boolean) => void,
	setError: (v: string | null) => void,
	errorMsg: string,
	fn:       () => Promise<T>
): Promise<T> {
	setBusy(true);
	setError(null);
	try {
		return await fn();
	} catch (err) {
		setError(errorMsg);
		throw err; // never swallow silently — let the caller show a toast
	} finally {
		setBusy(false);
	}
}
