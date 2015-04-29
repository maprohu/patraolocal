package hu.mapro.patraolocal;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.context.web.SpringBootServletInitializer;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

@Configuration
@EnableAutoConfiguration
@Import({ 
	PatraoLocalWebConfiguration.class
})
public class PatraoLocalApplication extends SpringBootServletInitializer {
    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(PatraoLocalApplication.class);
    }

    public static void main(String[] args) throws Exception {
        SpringApplication.run(PatraoLocalApplication.class, args);
    }
}
