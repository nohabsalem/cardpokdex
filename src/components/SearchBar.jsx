import React, { useEffect, useRef, useState } from "react";
import CardImage from "./CardImage.jsx";

function SearchBar({
	endpoint = "/api/search",
	paramName = "q",
	minChars = 2,
	debounceMs = 300,
	placeholder = "Rechercher...",
	onResults = () => {},
}) {
	const [query, setQuery] = useState("");
	const [results, setResults] = useState([]);
	const [selectedCardId, setSelectedCardId] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [isOpen, setIsOpen] = useState(false);

	const debounceRef = useRef(null);
	const abortRef = useRef(null);
	const containerRef = useRef(null);

	// Fetch/search effect (debounced)
	useEffect(() => {
		if (!query || query.length < minChars) {
			if (abortRef.current) {
				abortRef.current.abort();
				abortRef.current = null;
			}
			setLoading(false);
			setError(null);
			setResults([]);
			onResults([]);
			return;
		}

		setLoading(true);
		setError(null);

		if (debounceRef.current) clearTimeout(debounceRef.current);
		debounceRef.current = setTimeout(() => {
			if (abortRef.current) {
				abortRef.current.abort();
			}
			const controller = new AbortController();
			abortRef.current = controller;

			let url;
			try {
				url = new URL(endpoint, globalThis.location.origin);
			} catch (e) {
				url = new URL(globalThis.location.origin + endpoint);
			}
			url.searchParams.set(paramName, query);

			fetch(url.toString(), { signal: controller.signal })
				.then((res) => {
					if (!res.ok) throw new Error(res.statusText || "Erreur réseau");
					const contentType = res.headers.get("content-type") || "";
					if (contentType.includes("application/json")) {
						return res.json();
					}
					return res.text().then((text) => {
						const snippet = text.slice(0, 200).replaceAll(/\s+/g, " ");
						throw new Error(`Réponse inattendue (non-JSON): ${snippet}`);
					});
				})
				.then((data) => {
					setLoading(false);
					setError(null);
					setResults(data || []);
					onResults(data || []);
				})
				.catch((err) => {
					if (err.name === "AbortError") return;
					setLoading(false);
					setError(err.message || "Erreur");
					onResults([]);
				});
		}, debounceMs);

		return () => {
			if (debounceRef.current) clearTimeout(debounceRef.current);
		};
	}, [query, endpoint, paramName, minChars, debounceMs, onResults]);

	// Hash routing: open card detail when hash is #/card/<id>
	useEffect(() => {
		const hash = globalThis.location.hash || "";
		if (hash.startsWith("#/card/")) {
			setSelectedCardId(decodeURIComponent(hash.replace("#/card/", "")));
		}
		const onHashChange = () => {
			const h = globalThis.location.hash || "";
			if (h.startsWith("#/card/")) {
				setSelectedCardId(decodeURIComponent(h.replace("#/card/", "")));
			} else {
				setSelectedCardId(null);
			}
		};
		globalThis.addEventListener("hashchange", onHashChange);
		return () => globalThis.removeEventListener("hashchange", onHashChange);
	}, []);

	// Close popup on outside click or Escape
	useEffect(() => {
		const onDocClick = (e) => {
			if (!containerRef.current) return;
			if (!containerRef.current.contains(e.target)) {
				setIsOpen(false);
			}
		};

		const onKey = (e) => {
			if (e.key === "Escape") setIsOpen(false);
		};

		globalThis.addEventListener("mousedown", onDocClick);
		globalThis.addEventListener("keydown", onKey);
		return () => {
			globalThis.removeEventListener("mousedown", onDocClick);
			globalThis.removeEventListener("keydown", onKey);
		};
	}, []);

	return (
		<div ref={containerRef} style={{ position: "relative" }}>
			<div className="search-bar" style={{ display: "flex", alignItems: "center", gap: 8 }}>
				<input
					type="search"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					placeholder={placeholder}
					aria-label="Search"
					style={{ padding: "8px 10px", borderRadius: 6, border: "1px solid #ccc", minWidth: 220 }}
					onFocus={() => setIsOpen(true)}
				/>
				{loading && (
					<span aria-live="polite" style={{ fontSize: 12, color: "#666" }}>
						Chargement...
					</span>
				)}
				{error && (
					<span role="alert" style={{ fontSize: 12, color: "#c00" }}>
						{error}
					</span>
				)}
			</div>

			{/* Popup résultats */}
			{isOpen && (
				<div
					role="dialog"
					aria-label="Résultats de recherche"
					style={{
						position: "absolute",
						top: "calc(100% + 8px)",
						left: 0,
						zIndex: 9999,
						minWidth: 320,
						maxWidth: "min(90vw, 480px)",
						background: "#fff",
						boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
						borderRadius: 8,
						padding: 10,
						maxHeight: 320,
						overflow: "auto",
					}}
				>
					<div style={{ marginBottom: 8, fontSize: 13, color: "#333" }}>
						<strong>Résultats</strong> — {results.length}
					</div>
					{results && results.length > 0 ? (
						<ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
							{results.slice(0, 50).map((r) => (
								<li key={r.id} style={{ margin: "6px 0", padding: 6, borderRadius: 6 }}>
									<a
										href={`#/card/${encodeURIComponent(r.id)}`}
										onClick={() => {
											try {
												globalThis.location.hash = `#/card/${encodeURIComponent(r.id)}`;
											} catch (e) {
												globalThis.location.href = `#/card/${encodeURIComponent(r.id)}`;
											}
											setIsOpen(false);
										}}
										style={{ color: "#0366d6", textDecoration: "none" }}
									>
										<strong>{r.name}</strong>
									</a>
									<div style={{ fontSize: 12, color: "#444" }}>{r.set_id || r.set}</div>
								</li>
							))}
						</ul>
					) : (
						<div style={{ color: "#666" }}>Aucun résultat pour l'instant.</div>
					)}
				</div>
			)}

			{/* Détail de la carte sélectionnée */}
			{selectedCardId && (
				<section style={{ padding: 12, borderTop: "1px solid #eee" }}>
					<h3>Détail de la carte</h3>
					<button
						onClick={() => {
							globalThis.location.hash = "";
							setSelectedCardId(null);
						}}
						style={{ marginBottom: 8 }}
					>
						← Retour
					</button>
					<CardImage cardId={selectedCardId} />
				</section>
			)}
		</div>
	);
}

export default SearchBar;
