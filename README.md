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

        for (EtatFinancier ef : bilan.getEtatFinancierList()) {
            Long efId = insertEtatFinancier(ef, bilan.getSource());

            for (Poste p : ef.getPosteList()) {
                jdbcTemplate.update(
                    "INSERT INTO BEF_POSTE (code_poste, valeur, top_retraitement, commentaire, id_ef) VALUES (?, ?, ?, ?, ?)",
                    p.getCodePOSTE(), p.getValeur(), p.getTopRETRAITEMENT(), p.getCommentaire(), efId
                );
            }

            for (IndicateurLocal il : ef.getIndicateurLocalList()) {
                jdbcTemplate.update(
                    "INSERT INTO BEF_INDICATEUR_LOCAL (code_indicateur, valeur, top_retraitement, commentaire, id_ef) VALUES (?, ?, ?, ?, ?)",
                    il.getCodeIndicateur(), il.getValeur(), il.getTopRetraitement(), il.getCommentaire(), efId
                );
            }

            for (IndicateurCentral ic : ef.getIndicateurCentralList()) {
                jdbcTemplate.update(
                    "INSERT INTO BEF_INDICATEUR_CENTRAL (code_indicateur, valeur, commentaire, id_ef) VALUES (?, ?, ?, ?)",
                    ic.getCodeIndicateur(), ic.getValeur(), ic.getCommentaire(), efId
                );
            }
        }
    }

    private Long insertEtatFinancier(EtatFinancier ef, String source) {
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(
                "INSERT INTO BEF_ETAT_FINANCIER (" +
                "id, date_cre, duree_ex, date_clo, type_ef, modele_ef, code_devise, annee_ef, " +
                "periodicite_ef, top_confidentiel, top_public, unite, code_banque, code_etb, " +
                "date_file, version, date_acquisition, application, typologie, source" +
                ") VALUES (SEQ_ETAT_FINANCIER.NEXTVAL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                new String[] { "id" }
            );
            ps.setObject(1, ef.getDateCRE());
            ps.setObject(2, ef.getDureeEX());
            ps.setObject(3, ef.getDateCLO());
            ps.setString(4, ef.getTypeEF());
            ps.setString(5, ef.getModeleEF());
            ps.setString(6, ef.getCodeDevise());
            ps.setObject(7, ef.getAnneeEF());
            ps.setObject(8, ef.getPeriodiciteEF());
            ps.setObject(9, ef.getTopConfidentiel());
            ps.setObject(10, ef.getTopPublic());
            ps.setString(11, ef.getUnite());
            ps.setString(12, ef.getCodeBanque());
            ps.setString(13, ef.getCodeETB());
            ps.setObject(14, ef.getDateFile());
            ps.setObject(15, ef.getVersion());
            ps.setObject(16, ef.getDateAcquisition());
            ps.setString(17, ef.getApplication());
            ps.setString(18, ef.getTypologie());
            ps.setString(19, source);
            return ps;
        }, keyHolder);

        return keyHolder.getKey().longValue();
    }
}
