{"title":"react-mixin-manager","summary":"Give your components advanced mixin capabilities including mixin grouping and aliasing with dependency management.\n\n***Problem:*** React mixins get cumbersome because, if they are done right, they should be as granular as possible.  This is can be difficult sometimes because ***a)*** mixins can not duplicate attribute names and ***b)*** mixins must assume that all required functionality is available (creating DRY issues with multiple mixins using the same basic functionality).\n\n***Solution:*** Provide a manager that allows registering mixins by an alias and allowing dependencies to be specified on that mixin.  By allowing mixins to be included by alias, we can determine all dependencies and ensure that they are included (and not duplicated) as well.\n\n1. React mixins can be much more granular (because they are reused)\n2. Reduce a lot of DRY code when it comes to mixins because they can depend on existing functionality\n3. Less chance of mixin duplicate function name collision (because they are more granular and reused)\n4. 3rd party mixins can expose internal behaviors as registered mixins to be overridden by consumers","api":{"API":{"methods":{},"packages":{"React.mixins":{"overview":"","methods":{"add":{"profiles":["mixinName, mixin[, dependsOn, dependsOn, ...]"],"params":{"mixinName":"(string) the alias to be used when including the mixin for a React component","mixin":"the mixin object","dependsOn":"(string or array) the alias of another mixin that must be included if this mixin is included"},"summary":"Register the mixin to be referenced as the alias `mixinName` with any additional dependencies (by alias) as additional arguments.  This *will not* replace an existing mixin by that alias.","dependsOn":[],"overview":"##### Examples\n\n*Standard mixin*\n```\n// register myMixinImpl as the alias \"myMixin\"\nReact.mixins.add('myMixin', myMixinImpl);\n...\nReact.createClass({\n  mixins: ['myMixin', anyOtherPlainOldMixin]\n})\n// myMixinImpl, anyOtherPlainOldMixin will be included\n```\n\n*Mixin with dependencies*\n```\n// register mixin1Impl as the alias \"mixin1\"\nReact.mixins.add('mixin1', mixin1Impl);\n// register mixin2Impl as the alias \"mixin2\" with a dependency on the mixin defined by the alias \"mixin1\"\nReact.mixins.add('mixin2', mixin2Impl, 'mixin1');\n...\nReact.createClass({\n  // mixin1Impl, mixin2Impl, anyOtherPlainOldMixin will be included (a named mixin will never be included multiple times)\n  mixins: ['mixin2', anyOtherPlainOldMixin]\n})\n```\n***note***: if the registered mixin is a function, it will be executed and the return value will be used as the mixin"},"replace":{"profiles":["mixinName, mixin[, dependsOn, dependsOn, ...]"],"params":{"mixinName":"(string) the alias to be used when including the mixin for a React component","mixin":"the mixin object","dependsOn":"(string or array) the alias of another mixin that must be included if this mixin is included"},"summary":"Same as ```React.mixins.add``` but it *will replace* an existing mixin with the same alias.","dependsOn":[],"overview":""},"inject":{"profiles":["mixinName, dependsOn[, dependsOn, ...]"],"params":{"mixinName":"(string) the alias to be used when including the mixin for a React component","dependsOn":"(string or array) the alias of another mixin that must be included if this mixin is included"},"summary":"Add additional dependencies to a mixin that has already been registered.  This is not useful for mixins that you create but can be useful to group additional mixins when 3rd party mixins are referenced.","dependsOn":[],"overview":"##### Examples\n```\n// register myMixinImpl as the alias \"myMixin\"\nReact.mixins.add('myMixin', myMixinImpl);\n\n// \"tpMixin\" is a 3rd party mixin that has already been registered which has no dependencies\nReact.mixins.inject('tpMixin', 'myMixin');\n...\nReact.createClass({\n  // \"tpMixin\" and \"myMixin\" will be included\n  mixins: ['tpMixin']\n})\n\n```"},"alias":{"profiles":["mixinName, dependsOn[, dependsOn, ...]"],"params":{"mixinName":"(string) the alias to be used when including the mixin for a React component","dependsOn":"(string or array) the alias of another mixin that must be included if this mixin is included"},"summary":"Define an alias which can be used to group multiple named mixins together so that a single mixin alias will import all grouped mixins.","dependsOn":[],"overview":"##### Examples\n```\n// register mixin1Impl as the alias \"mixin1\"\nReact.mixins.add('mixin1', mixin1Impl);\n\n// register mixin2Impl as the alias \"mixin2\"\nReact.mixins.add('mixin1', mixin1Impl);\n\n// group these mixins into a single alias \"all\" that can be referenced\nReact.mixins.alias('all', 'mixin1', 'mixin2');\n\n...\nReact.createClass({\n  // \"mixin1\" and \"mixin2\" will be included\n  mixins: ['all']\n})\n```"}}}}},"Mixins":{"methods":{},"packages":{"deferUpdate":{"overview":"Mixin used to make available a single function ```deferUpdate``` to your component.","methods":{"deferUpdate":{"profiles":["()"],"params":{},"summary":"This is similar to [forceUpdate](#link/http%3A%2F%2Ffacebook.github.io%2Freact%2Fdocs%2Fcomponent-api.html) but after a setTimeout(0).  Any calls to deferUpdate before the callback fires will execute only a single [forceUpdate](#link/http%3A%2F%2Ffacebook.github.io%2Freact%2Fdocs%2Fcomponent-api.html) call.  This can be beneficial for mixins that listen to certain events that might cause a render multiple times unnecessarily.","dependsOn":[],"overview":"##### Examples\n```\nReact.createClass({\n  mixin: ['deferUpdate'],\n\n  somethingThatRequiresUpdate: function() {\n    this.deferUpdate();\n  }\n});\n```"}}}}}},"sections":[{"body":"","title":"Advanced Features","sections":[{"body":"If the mixin that is registered is a function, the result of that function will be used as the actual mixin provided to the React component.  This can be useful if runtime conditions need to be evaluated to determine what should be exposed to the component.\n\n```\nReact.mixins.add('myMixin', function() {\n  if (window.something) {\n    return mixin1;\n  } else {\n    return mixin2;\n  }\n});\n...\nvar myComponent = React.createClass({\n  mixins: ['myMixin'],\n  ...\n});\n```\nIn this example, when *myComponent* is declared (not instantiated), based on the *something* global variable, either *mixin1* or *mixin2* will be applied.","title":"Dynamic Mixins","sections":[]},{"body":"It is occasionally useful to add dynamic behavior to the mixin that is not based on some property set by the parent but rather a property that is internally defined by the component being instantiated.  This can be done by using *Dynamic Mixins* (see above).  When a function is used to return the mixin, any parameters supplied when referencing the mixin will supplied as arguments.\n\n```\nReact.mixins.add('myMixin', function(something) {\n  if (something) {\n    return mixin1;\n  } else {\n    return mixin2;\n  }\n});\n...\nvar myComponent = React.createClass({\n  mixins: ['myMixin(\"foo\")'],\n  ...\n});\n```\nIn this example, when *myComponent* is declared (not instantiated), based on the *something* variable provided by the React component using the mixin, either *mixin1* or *mixin2* will be applied.\n\n*note: booleans and numbers can be used as well so make sure to wrap strings with quotes*","title":"Mixins With Parameters","sections":[]}]}]}