package hu.mapro.patraolocal;

import org.junit.Test;
import org.yaml.snakeyaml.Yaml;

import com.google.gson.Gson;

public class TestYamlJson {
	
	@Test
	public void test() {
		Yaml yaml = new Yaml();
		Object data = yaml.load(getClass().getResourceAsStream("/static/data/exam.yaml"));
		Gson gson = new Gson();
		String json = gson.toJson(data);
		System.out.println(json);
	}

}
