export const APP_PROPERTIES = {

  env: (!process.env.NODE_ENV) ? 'local':process.env.NODE_ENV,
  domain:function(){
    if(process.env.NODE_ENV === 'production'){
      return APP_PROPERTIES.production.domain;
    }else {
      return APP_PROPERTIES.local.domain;
    }
  },
  local:{
    domain:{
      mainHost: 'http://localhost:8000',
      upload: 'https://24gvmjxwme.execute-api.us-west-1.amazonaws.com',
      image: 'https://thumb.share.decompany.io',
      api: "https://api.share.decompany.io/dev"
    }
  },
  production:{
    domain:{
      mainHost: 'https://share.decompany.io',
      upload: 'https://24gvmjxwme.execute-api.us-west-1.amazonaws.com',
      image: 'https://thumb.share.decompany.io',
      api: "https://api.share.decompany.io/dev"
    }
  },
  service_endpoint:{

  }

};
