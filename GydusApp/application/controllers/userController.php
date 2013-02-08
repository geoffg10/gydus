<?
	class userController extends CI_Controller{

		function login(){
		
			$data = array();
				
			$data['content'] = 'loginView';
			$this->load->view('templates/template', $data);
		
		
		}
		function register(){
		
			$data = array();
				
			$data['content'] = 'registerView';
			$this->load->view('templates/template', $data);
		
		
		}

	}
?>