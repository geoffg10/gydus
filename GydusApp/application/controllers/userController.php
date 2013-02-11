<?
	class userController extends CI_Controller{

		function login(){
		
<<<<<<< HEAD
			$this->load->model('membership_model');
		$query = $this->membership_model->validate();
		
		if($query) // if the user's credentials validated...
		{
			$data = array(
				'uname' => $this->input->post('uname'),
				'is_logged_in' => true
			);				
/* 			echo("hello user"); */

							$this->load->view('members_area');

/* 			redirect('site/members_area'); */
		}
/* 			redirect('site/members_area'); */
			
			else // incorrect username or password
			{
			$this->index();	

=======
			$data = array();
>>>>>>> parent of f8f88b0... Created the php for the login with codeigniter
				
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