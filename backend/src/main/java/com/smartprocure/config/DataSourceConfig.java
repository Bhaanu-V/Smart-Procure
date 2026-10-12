package com.smartprocure.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.io.IOException;
import java.net.Socket;
import java.net.URI;
import java.sql.Connection;

@Configuration
public class DataSourceConfig {

    private static final Logger log = LoggerFactory.getLogger(DataSourceConfig.class);

    @Value("${spring.datasource.url:}")
    private String configuredUrl;

    @Value("${spring.datasource.username:}")
    private String configuredUsername;

    @Value("${spring.datasource.password:}")
    private String configuredPassword;

    @Value("${spring.datasource.driver-class-name:}")
    private String configuredDriver;

    @Value("${DB_HOST:}")
    private String dbHost;

    @Value("${DB_PORT:5432}")
    private String dbPort;

    @Value("${DB_NAME:smartprocure_db}")
    private String dbName;

    @Value("${DB_USERNAME:}")
    private String dbUsername;

    @Value("${DB_PASSWORD:}")
    private String dbPassword;

    @Bean
    @Primary
    public DataSource dataSource() {
        String databaseUrl = System.getenv("DATABASE_URL");
        if (databaseUrl != null && !databaseUrl.isBlank()) {
            DataSource ds = tryConfigureFromDatabaseUrl(databaseUrl);
            if (ds != null) {
                return ds;
            }
        }

        String springUrl = System.getenv("SPRING_DATASOURCE_URL");
        if (springUrl != null && !springUrl.isBlank()) {
            DataSource ds = tryCreateHikariDataSource(springUrl,
                    System.getenv("SPRING_DATASOURCE_USERNAME"),
                    System.getenv("SPRING_DATASOURCE_PASSWORD"),
                    configuredDriver.isBlank() ? "org.postgresql.Driver" : configuredDriver,
                    "SPRING_DATASOURCE_URL");
            if (ds != null) {
                return ds;
            }
        }

        // Check if DB_HOST is explicitly configured to a non-localhost host (e.g. Render DB, TiDB, RDS)
        if (dbHost != null && !dbHost.isBlank() && !dbHost.equalsIgnoreCase("localhost") && !dbHost.equals("127.0.0.1")) {
            int port = 5432;
            try {
                port = Integer.parseInt(dbPort);
            } catch (NumberFormatException ignored) {}

            String driver = port == 4000 || port == 3306 ? "com.mysql.cj.jdbc.Driver" : "org.postgresql.Driver";
            String protocol = port == 4000 || port == 3306 ? "jdbc:mysql://" : "jdbc:postgresql://";
            String url = protocol + dbHost + ":" + port + "/" + dbName;
            if (port == 4000 || port == 3306) {
                url += "?createDatabaseIfNotExist=true&useSSL=true&requireSSL=true&verifyServerCertificate=false&allowPublicKeyRetrieval=true";
            }

            DataSource ds = tryCreateHikariDataSource(url, dbUsername, dbPassword, driver, "DB_HOST: " + dbHost);
            if (ds != null) {
                return ds;
            }
        }

        // If configured URL is present
        if (configuredUrl != null && !configuredUrl.isBlank()) {
            // If it points to localhost, verify if localhost port is actually reachable
            if (configuredUrl.contains("localhost") || configuredUrl.contains("127.0.0.1")) {
                int port = 5432;
                if (configuredUrl.contains(":3306")) port = 3306;
                else if (configuredUrl.contains(":4000")) port = 4000;

                if (!isPortOpen("localhost", port)) {
                    log.warn("Database host at localhost:{} is unreachable (Cloud environment detected). Falling back to embedded H2 database.", port);
                    return createH2FallbackDataSource();
                }
            }

            DataSource ds = tryCreateHikariDataSource(configuredUrl, configuredUsername, configuredPassword, configuredDriver, "configuredUrl");
            if (ds != null) {
                return ds;
            }
        }

        log.info("No external database reachable. Activating embedded H2 database for zero-config deployment.");
        return createH2FallbackDataSource();
    }

    private DataSource tryConfigureFromDatabaseUrl(String rawUrl) {
        try {
            log.info("Detected DATABASE_URL environment variable.");
            if (rawUrl.startsWith("jdbc:")) {
                return tryCreateHikariDataSource(rawUrl, null, null, "org.postgresql.Driver", "DATABASE_URL (JDBC)");
            }

            URI uri = new URI(rawUrl);
            String host = uri.getHost();
            int port = uri.getPort() > 0 ? uri.getPort() : 5432;
            String path = uri.getPath(); // e.g. /smartprocure_db
            String userInfo = uri.getUserInfo();
            String username = "";
            String password = "";

            if (userInfo != null) {
                String[] parts = userInfo.split(":", 2);
                username = parts[0];
                if (parts.length > 1) {
                    password = parts[1];
                }
            }

            String query = uri.getQuery();
            String jdbcUrl = "jdbc:postgresql://" + host + ":" + port + path;
            if (query != null && !query.isBlank()) {
                jdbcUrl += "?" + query;
            }

            return tryCreateHikariDataSource(jdbcUrl, username, password, "org.postgresql.Driver", "DATABASE_URL (" + host + ")");
        } catch (Exception e) {
            log.error("Failed to parse DATABASE_URL: {}. Falling back to standard configuration.", e.getMessage());
            return null;
        }
    }

    private DataSource tryCreateHikariDataSource(String url, String username, String password, String driver, String sourceDesc) {
        try {
            log.info("Attempting connection to DataSource via {}: {}", sourceDesc, url);
            HikariConfig config = new HikariConfig();
            config.setJdbcUrl(url);
            if (username != null && !username.isBlank()) config.setUsername(username);
            if (password != null && !password.isBlank()) config.setPassword(password);
            if (driver != null && !driver.isBlank()) config.setDriverClassName(driver);
            config.setMaximumPoolSize(10);
            config.setMinimumIdle(2);
            config.setConnectionTimeout(15000); // 15 sec timeout
            config.setInitializationFailTimeout(10000); // Fail fast to allow fallback

            HikariDataSource ds = new HikariDataSource(config);
            // Test connection
            try (Connection conn = ds.getConnection()) {
                log.info("Successfully connected to DataSource via {}", sourceDesc);
                return ds;
            } catch (Exception ex) {
                log.warn("Database connection verification failed for {}: {}. Will fallback.", sourceDesc, ex.getMessage());
                ds.close();
                return null;
            }
        } catch (Exception e) {
            log.warn("Failed to initialize DataSource from {}: {}. Will fallback.", sourceDesc, e.getMessage());
            return null;
        }
    }

    private DataSource createH2FallbackDataSource() {
        log.info("==================================================================");
        log.info("Starting SmartProcure in Embedded Database Mode (H2 in-memory).");
        log.info("Initial data seeds and demo accounts are active.");
        log.info("==================================================================");
        HikariConfig config = new HikariConfig();
        config.setJdbcUrl("jdbc:h2:mem:smartprocure_db;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE;MODE=PostgreSQL");
        config.setDriverClassName("org.h2.Driver");
        config.setUsername("sa");
        config.setPassword("");
        config.setMaximumPoolSize(10);
        return new HikariDataSource(config);
    }

    private boolean isPortOpen(String host, int port) {
        try (Socket socket = new Socket(host, port)) {
            return true;
        } catch (IOException e) {
            return false;
        }
    }
}
