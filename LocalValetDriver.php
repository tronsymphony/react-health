<?php

class LocalValetDriver extends ValetDriver
{
	public function serves($sitePath, $siteName, $uri)
	{
		return $uri === '/wordpress/graphql';
	}

	public function isStaticFile($sitePath, $siteName, $uri)
	{
		return file_exists(rtrim($sitePath . '/wordpress/' . $uri, '/')) ? rtrim($sitePath . '/wordpress/' . $uri, '/') : false;
	}

	public function frontControllerPath($sitePath, $siteName, $uri)
	{
		return $sitePath . '/wordpress/index.php';
	}
}