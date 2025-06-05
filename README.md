@Service
public class BilanJdbcBatchService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public void insertBilanWithAll(Bilan bilan) {
        // Insert BILAN
        jdbcTemplate.update(
            "INSERT INTO BEF_BILAN (source, nb_etat_financier, nb_poste, nb_indicateur) VALUES (?, ?, ?, ?)",
            bilan.getSource(), bilan.getNbEtatFinancier(), bilan.getNbPoste(), bilan.getNbIndicateur()
        );

        List<Object[]> efBatch = new ArrayList<>();
        List<Object[]> posteBatch = new ArrayList<>();
        List<Object[]> localBatch = new ArrayList<>();
        List<Object[]> centralBatch = new ArrayList<>();

        long efId = 1L; // simulate IDs or use sequences
        for (EtatFinancier ef : bilan.getEtatFinancierList()) {
            efBatch.add(new Object[]{
                efId, ef.getDateCRE(), ef.getTypeEF(), bilan.getSource() // add other needed fields
            });

            for (Poste p : ef.getPosteList()) {
                posteBatch.add(new Object[]{
                    p.getCodePOSTE(), p.getValeur(), p.getTopRETRAITEMENT(), p.getCommentaire(), efId
                });
            }

            for (IndicateurLocal il : ef.getIndicateurLocalList()) {
                localBatch.add(new Object[]{
                    il.getCodeIndicateur(), il.getValeur(), il.getTopRetraitement(), il.getCommentaire(), efId
                });
            }

            for (IndicateurCentral ic : ef.getIndicateurCentralList()) {
                centralBatch.add(new Object[]{
                    ic.getCodeIndicateur(), ic.getValeur(), ic.getCommentaire(), efId
                });
            }

            efId++;
        }

        // Batch insert all
        batchInsert("INSERT INTO BEF_ETAT_FINANCIER (id, date_cre, type_ef, source) VALUES (?, ?, ?, ?)", efBatch);
        batchInsert("INSERT INTO BEF_POSTE (code_poste, valeur, top_retraitement, commentaire, id_ef) VALUES (?, ?, ?, ?, ?)", posteBatch);
        batchInsert("INSERT INTO BEF_INDICATEUR_LOCAL (code_indicateur, valeur, top_retraitement, commentaire, id_ef) VALUES (?, ?, ?, ?, ?)", localBatch);
        batchInsert("INSERT INTO BEF_INDICATEUR_CENTRAL (code_indicateur, valeur, commentaire, id_ef) VALUES (?, ?, ?, ?)", centralBatch);
    }

    private void batchInsert(String sql, List<Object[]> batchArgs) {
        int batchSize = 500;
        for (int i = 0; i < batchArgs.size(); i += batchSize) {
            List<Object[]> batch = batchArgs.subList(i, Math.min(i + batchSize, batchArgs.size()));
            jdbcTemplate.batchUpdate(sql, batch);
        }
    }
}
