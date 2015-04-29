package hu.mapro.patraolocal;

import hu.mapro.mfw.web.MfwWebConfiguration;
import hu.mapro.mfw.web.MfwWebConfigurer;
import hu.mapro.mfw.web.MfwWebSettings;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

@Configuration
@Import({MfwWebConfiguration.class})
public class PatraoLocalWebConfiguration {

	@Bean
	MfwWebConfigurer mfwWebConfigurer() {
		return new MfwWebConfigurer() {
			@Override
			public void configure(MfwWebSettings settings) {
				settings.setApplicationTitle("Patrao Local");
			}
		};
	}
}
