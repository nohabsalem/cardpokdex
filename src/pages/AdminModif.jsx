import React, {useState, useEffect} from "react";

export default function AdminModif() {
	const [isAdmin, setIsAdmin] = useState(false);
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [mode, setMode] = useState("cards");

	const [cards, setCards] = useState([]);
	const [sets, setSets] = useState([]);
	const [query, setQuery] = useState("");
	const [results, setResults] = useState([]);

	const [editingItem, setEditingItem] = useState(null);
	const [message, setMessage] = useState("");

	const API = "http://localhost:5000/api";

	const inputStyle = { padding: '6px 8px', border: '1px solid #ccc', borderRadius: 4, width: '100%', boxSizing: 'border-box' };

	useEffect(() => {
		if (isAdmin) {
			fetchAll();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isAdmin]);

	async function fetchAll() {
		try {
			const [cardsRes, setsRes] = await Promise.all([
				fetch(`${API}/cards`).then(r => r.json()),
				fetch(`${API}/sets`).then(r => r.json())
			]);
			setCards(cardsRes || []);
			setSets(setsRes || []);
			setResults([]);
		} catch (e) {
			console.error(e);
			setMessage('Erreur réseau lors de la récupération des données.');
		}
	}

	function handleLogin(e) {
		e.preventDefault();
		if (username === 'admin' && password === 'admin') {
			setIsAdmin(true);
			setMessage('Connecté en tant qu\'administrateur');
		} else {
			setMessage('Identifiants incorrects');
		}
	}

	function handleLogout() {
		setIsAdmin(false);
		setUsername('');
		setPassword('');
		setCards([]);
		setSets([]);
		setResults([]);
		setEditingItem(null);
		setMessage('Déconnecté');
	}

	function searchLocal() {
		const q = query.trim().toLowerCase();
		if (!q) {
			setResults([]);
			return;
		}
		if (mode === 'cards') {
			const filtered = cards.filter(c => (
				(c.id && String(c.id).toLowerCase().includes(q)) ||
				(c.name && c.name.toLowerCase().includes(q)) ||
				(c.number && String(c.number).toLowerCase().includes(q))
			));
			setResults(filtered);
		} else {
			const filtered = sets.filter(s => (
				(s.id && String(s.id).toLowerCase().includes(q)) ||
				(s.name && s.name.toLowerCase().includes(q))
			));
			setResults(filtered);
		}
	}

	async function handleDelete(itemId) {
		if (!window.confirm('Confirmer la suppression ?')) return;
		try {
			const url = mode === 'cards' ? `${API}/card/delete/${itemId}` : `${API}/set/delete/${itemId}`;
			const res = await fetch(url, { method: 'DELETE' });
			if (!res.ok) {
				const err = await res.json();
				setMessage(err.message || 'Erreur lors de la suppression');
				return;
			}
			setMessage('Suppression réussie');
			await fetchAll();
			setResults(prev => prev.filter(i => String(i.id) !== String(itemId)));
		} catch (e) {
			console.error(e);
			setMessage('Erreur réseau lors de la suppression');
		}
	}

	function openEdit(item) {
		// clone to avoid mutating list
		setEditingItem({ ...item });
		setMessage('');
	}

	function cancelEdit() {
		setEditingItem(null);
	}

	async function submitEdit(e) {
		e.preventDefault();
		if (!editingItem) return;
		try {
			const id = editingItem.id;
			const url = mode === 'cards' ? `${API}/card/update/${id}` : `${API}/set/update/${id}`;
			const res = await fetch(url, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(editingItem)
			});
			const data = await res.json();
			if (!res.ok) {
				setMessage(data.message || 'Erreur lors de la mise à jour');
				return;
			}
			setMessage(data.message || 'Mise à jour réussie');
			setEditingItem(null);
			await fetchAll();
		} catch (e) {
			console.error(e);
			setMessage('Erreur réseau lors de la mise à jour');
		}
	}

	return (
		<div style={{ padding: 20 }}>
			<h2>Administration</h2>
			{!isAdmin ? (
				<form onSubmit={handleLogin} style={{ maxWidth: 360 }}>
					<div>
						<label>Utilisateur</label>
						<input style={inputStyle} value={username} onChange={e => setUsername(e.target.value)} />
					</div>
					<div style={{ marginTop: 8 }}>
						<label>Mot de passe</label>
						<input style={inputStyle} type="password" value={password} onChange={e => setPassword(e.target.value)} />
					</div>
					<div style={{ marginTop: 12 }}>
						<button type="submit">Se connecter</button>
					</div>
					<div style={{ marginTop: 8, color: 'red' }}>{message}</div>
				</form>
			) : (
				<div>
					<div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
						<div>
							<label>
								<input type="radio" checked={mode === 'cards'} onChange={() => setMode('cards')} /> Cartes
							</label>
							<label style={{ marginLeft: 8 }}>
								<input type="radio" checked={mode === 'sets'} onChange={() => setMode('sets')} /> Sets
							</label>
						</div>
						<div style={{ marginLeft: 'auto' }}>
							<button onClick={handleLogout}>Se déconnecter</button>
						</div>
					</div>

					<div style={{ marginTop: 12 }}>
						<input style={{ ...inputStyle, width: 360 }} placeholder={mode === 'cards' ? 'Chercher par id/nom/numéro' : 'Chercher par id/nom'} value={query} onChange={e => setQuery(e.target.value)} />
						<button onClick={searchLocal} style={{ marginLeft: 8 }}>Rechercher</button>
						<button onClick={() => { setQuery(''); setResults([]); }} style={{ marginLeft: 8 }}>Réinitialiser</button>
					</div>

					<div style={{ marginTop: 12 }}>
						{message && <div style={{ marginBottom: 8 }}>{message}</div>}

						{editingItem ? (
							<form onSubmit={submitEdit} style={{ border: '1px solid #ccc', padding: 12, maxWidth: 720 }}>
								<h3>Éditer {mode === 'cards' ? 'Carte' : 'Set'}: {editingItem.id}</h3>
								{mode === 'cards' ? (
									<div>
										<div>
											<label>Nom</label>
											<input style={inputStyle} value={editingItem.name || ''} onChange={e => setEditingItem({ ...editingItem, name: e.target.value })} />
										</div>
										<div>
											<label>Numéro</label>
											<input style={inputStyle} value={editingItem.number || ''} onChange={e => setEditingItem({ ...editingItem, number: e.target.value })} />
										</div>
										<div>
											<label>Artiste</label>
											<input style={inputStyle} value={editingItem.artist || ''} onChange={e => setEditingItem({ ...editingItem, artist: e.target.value })} />
										</div>
										<div>
											<label>Rareté</label>
											<input style={inputStyle} value={editingItem.rarity || ''} onChange={e => setEditingItem({ ...editingItem, rarity: e.target.value })} />
										</div>
										<div>
											<label>Set ID</label>
											<input style={inputStyle} value={editingItem.set_id || ''} onChange={e => setEditingItem({ ...editingItem, set_id: e.target.value })} />
										</div>
										</div>
								) : (
									<div>
										<div>
											<label>Nom</label>
											<input style={inputStyle} value={editingItem.name || ''} onChange={e => setEditingItem({ ...editingItem, name: e.target.value })} />
										</div>
										<div>
											<label>Série</label>
											<input style={inputStyle} value={editingItem.series || ''} onChange={e => setEditingItem({ ...editingItem, series: e.target.value })} />
										</div>
										<div>
											<label>Total</label>
											<input style={inputStyle} value={editingItem.total || ''} onChange={e => setEditingItem({ ...editingItem, total: e.target.value })} />
										</div>
										<div>
											<label>Date de sortie</label>
											<input style={inputStyle} value={editingItem.releaseDate || ''} onChange={e => setEditingItem({ ...editingItem, releaseDate: e.target.value })} />
										</div>
										</div>
								)}
								<div style={{ marginTop: 8 }}>
									<button type="submit">Sauvegarder</button>
									<button type="button" onClick={cancelEdit} style={{ marginLeft: 8 }}>Annuler</button>
								</div>
							</form>
						) : (
							<div>
								<h3>Résultats</h3>
								<div>
									{results.length === 0 ? (
										<div>Aucun résultat (ou entrez une recherche)</div>
									) : (
										<table style={{ width: '100%', borderCollapse: 'collapse' }}>
											<thead>
												<tr>
													<th style={{ borderBottom: '1px solid #ccc', textAlign: 'left' }}>ID</th>
													<th style={{ borderBottom: '1px solid #ccc', textAlign: 'left' }}>Nom</th>
													<th style={{ borderBottom: '1px solid #ccc', textAlign: 'left' }}>Infos</th>
													<th style={{ borderBottom: '1px solid #ccc' }}></th>
												</tr>
											</thead>
											<tbody>
												{results.map(item => (
													<tr key={item.id}>
														<td style={{ padding: '6px 4px' }}>{item.id}</td>
														<td style={{ padding: '6px 4px' }}>{item.name}</td>
														<td style={{ padding: '6px 4px' }}>{mode === 'cards' ? `${item.number || ''} — ${item.rarity || ''}` : `${item.series || ''}`}</td>
														<td style={{ padding: '6px 4px' }}>
															<button onClick={() => openEdit(item)}>Éditer</button>
															<button onClick={() => handleDelete(item.id)} style={{ marginLeft: 8 }}>Supprimer</button>
														</td>
													</tr>
												))}
											</tbody>
										</table>
									)}
								</div>
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
}
    